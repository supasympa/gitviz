import * as d3 from 'd3';

export const makeViz = (chartNode: any, gitData: any) => {
    const width = window.innerWidth -100,
        height = window.innerHeight -100,
        maxRadius = Math.min(width, height) / 2 - 5;

    const formatNumber = d3.format(',d');

    const x = d3
        .scaleLinear()
        .range([0, 2 * Math.PI])
        .clamp(true);

    const y = d3.scaleSqrt().range([maxRadius * 0.1, maxRadius]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    // const color = d3.scaleOrdinal(d3.schemeRdYlBu);
    
    const partition = d3.partition();

    const arc = d3
        .arc()
        .startAngle((d: any) => x(d.x0))
        .endAngle((d: any) => x(d.x1))
        .innerRadius((d: any) => Math.max(0, y(d.y0)))
        .outerRadius((d: any) => Math.max(0, y(d.y1)));

    const middleArcLine = (d: any) => {
        const halfPi = Math.PI / 2;
        const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
        const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

        const middleAngle = (angles[1] + angles[0]) / 2;
        const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
        if (invertDirection) {
            angles.reverse();
        }

        const path = d3.path();
        path.arc(0, 0, r, angles[0], angles[1], invertDirection);
        return path.toString();
    };

    const textFits = (d: any) => {
        const CHAR_SPACE = 6;

        const deltaAngle = x(d.x1) - x(d.x0);
        const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
        const perimeter = r * deltaAngle;

        return d.data.name.length * CHAR_SPACE < perimeter;
    };

    const svg = d3
        .select('body')
        .append('svg')
        .style('width', '100vw')
        .style('height', '100vh')
        .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
        .on('click', () => focusOn()); // Reset zoom on canvas click

    d3.json('./git-changes.json').then((root: any) => {
        Object.keys(root).forEach((key) => (root[key] = root[key].length));
        root = buildHierarchy(Object.entries(root));
        console.log(root);
        root = d3.hierarchy(root);

        root.sum((d: any) => d.size);

        const slice = svg
            .selectAll('g.slice')
            .data(partition(root).descendants());

        slice.exit().remove();

        const newSlice = slice
            .enter()
            .append('g')
            .attr('class', 'slice')
            .on('click', (d: any) => {
                d3.event.stopPropagation();
                focusOn(d);
            });

        newSlice
            .append('title')
            .text((d: any) => d.data.name + '\n' + formatNumber(d.value));

        newSlice
            .append('path')
            .attr('class', 'main-arc')
            .style('fill', (d: any) =>
                color((d.children ? d : d.parent).data.name)
            )
            .attr('d', arc as any);

        newSlice
            .append('path')
            .attr('class', 'hidden-arc')
            .attr('id', (_, i) => `hiddenArc${i}`)
            .attr('d', middleArcLine);

        const text = newSlice
            .append('text')
            .attr('display', (d) => (textFits(d) ? null : 'none'));

        // Add white contour
        text.append('textPath')
            .attr('startOffset', '50%')
            .attr('xlink:href', (_, i) => `#hiddenArc${i}`)
            .text((d: any) => d.data.name)
            .style('fill', 'none')
            .style('stroke', 'rgba(255, 255, 255, 0.5)')
            .style('stroke-width', 1)
            .style('stroke-linejoin', 'round');

        text.append('textPath')
            .attr('startOffset', '50%')
            .attr('xlink:href', (_, i) => `#hiddenArc${i}`)
            .text((d: any) => d.data.name);
    });

    function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
        // Reset to top-level if no data point specified

        const transition = svg
            .transition()
            .duration(750)
            .tween('scale', () => {
                const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                    yd = d3.interpolate(y.domain(), [d.y0, 1]);
                return (t: any) => {
                    x.domain(xd(t));
                    y.domain(yd(t));
                };
            });

        transition
            .selectAll('path.main-arc')
            .attrTween('d', (d: any) => () => arc(d) as string);
        transition
            .selectAll('path.hidden-arc')
            .attrTween('d', (d: any) => () => middleArcLine(d) as any);

        transition
            .selectAll('text')
            .attrTween('display', (d) => () =>
                (textFits(d) ? null : 'none') as string
            );

        moveStackToFront(d);

        //

        function moveStackToFront(elD: any) {
            svg.selectAll('.slice')
                .filter((d) => d === elD)
                .each(function(d: any) {
                    // @ts-ignore
                    this.parentNode.appendChild(this);
                    if (d.parent) {
                        moveStackToFront(d.parent);
                    }
                });
        }
    }
};

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how
// often that sequence occurred.
function buildHierarchy(csv: any) {
    var root = { name: 'root', children: [] };
    for (var i = 0; i < csv.length; i++) {
        var sequence = csv[i][0];
        var size = +csv[i][1];
        if (isNaN(size)) {
            // e.g. if this is a header row
            continue;
        }
        var parts = sequence.split('/');
        var currentNode = root;
        for (var j = 0; j < parts.length; j++) {
            var children = currentNode['children'];
            var nodeName = parts[j];
            var childNode;
            if (j + 1 < parts.length) {
                // Not yet at the end of the sequence; move down the tree.
                var foundChild = false;
                for (var k = 0; k < children.length; k++) {
                    if (children[k]['name'] == nodeName) {
                        childNode = children[k];
                        foundChild = true;
                        break;
                    }
                }
                // If we don't already have a child node for this branch, create it.
                if (!foundChild) {
                    childNode = { name: nodeName, children: [] };
                    children.push(childNode as never);
                }
                // @ts-ignore
                currentNode = childNode;
            } else {
                // Reached the end of the sequence; create a leaf node.
                childNode = { name: nodeName, size: size };
                children.push(childNode as never);
            }
        }
    }
    return root;
}


const colors  = () => [
"#3957ff", "#d3fe14", "#c9080a", "#fec7f8", "#0b7b3e", "#0bf0e9", "#c203c8", "#fd9b39", "#888593", "#906407", "#98ba7f", "#fe6794", "#10b0ff", "#ac7bff", "#fee7c0", "#964c63", "#1da49c", "#0ad811", "#bbd9fd", "#fe6cfe", "#297192", "#d1a09c", "#78579e", "#81ffad", "#739400", "#ca6949", "#d9bf01", "#646a58", "#d5097e", "#bb73a9", "#ccf6e9", "#9cb4b6", "#b6a7d4", "#9e8c62", "#6e83c8", "#01af64", "#a71afd", "#cfe589", "#d4ccd1", "#fd4109", "#bf8f0e", "#2f786e", "#4ed1a5", "#d8bb7d", "#a54509", "#6a9276", "#a4777a", "#fc12c9", "#606f15", "#3cc4d9", "#f31c4e", "#73616f", "#f097c6", "#fc8772", "#92a6fe", "#875b44", "#699ab3", "#94bc19", "#7d5bf0", "#d24dfe", "#c85b74", "#68ff57", "#b62347", "#994b91", "#646b8c", "#977ab4", "#d694fd", "#c4d5b5", "#fdc4bd", "#1cae05", "#7bd972", "#e9700a", "#d08f5d", "#8bb9e1", "#fde945", "#a29d98", "#1682fb", "#9ad9e0", "#d6cafe", "#8d8328", "#b091a7", "#647579", "#1f8d11", "#e7eafd", "#b9660b", "#a4a644", "#fec24c", "#b1168c", "#188cc1", "#7ab297", "#4468ae", "#c949a6", "#d48295", "#eb6dc2", "#d5b0cb", "#ff9ffb", "#fdb082", "#af4d44", "#a759c4", "#a9e03a", "#0d906b", "#9ee3bd", "#5b8846", "#0d8995", "#f25c58", "#70ae4f", "#847f74", "#9094bb", "#ffe2f1", "#a67149", "#936c8e", "#d04907", "#c3b8a6", "#cef8c4", "#7a9293", "#fda2ab", "#2ef6c5", "#807242", "#cb94cc", "#b6bdd0", "#b5c75d", "#fde189", "#b7ff80", "#fa2d8e", "#839a5f", "#28c2b5", "#e5e9e1", "#bc79d8", "#7ed8fe", "#9f20c3", "#4f7a5b", "#f511fd", "#09c959", "#bcd0ce", "#8685fd", "#98fcff", "#afbff9", "#6d69b4", "#5f99fd", "#aaa87e", "#b59dfb", "#5d809d", "#d9a742", "#ac5c86", "#9468d5", "#a4a2b2", "#b1376e", "#d43f3d", "#05a9d1", "#c38375", "#24b58e", "#6eabaf", "#66bf7f", "#92cbbb", "#ddb1ee", "#1be895", "#c7ecf9", "#a6baa6", "#8045cd", "#5f70f1", "#a9d796", "#ce62cb", "#0e954d", "#a97d2f", "#fcb8d3", "#9bfee3", "#4e8d84", "#fc6d3f", "#7b9fd4", "#8c6165", "#72805e", "#d53762", "#f00a1b", "#de5c97", "#8ea28b", "#fccd95", "#ba9c57", "#b79a82", "#7c5a82", "#7d7ca4", "#958ad6", "#cd8126", "#bdb0b7", "#10e0f8", "#dccc69", "#d6de0f", "#616d3d", "#985a25", "#30c7fd", "#0aeb65", "#e3cdb4", "#bd1bee", "#ad665d", "#d77070", "#8ea5b8", "#5b5ad0", "#76655e", "#598100", "#86757e", "#5ea068", "#a590b8", "#c1a707", "#85c0cd", "#e2cde9", "#dcd79c", "#d8a882", "#b256f9", "#b13323", "#519b3b", "#dd80de", "#f1884b", "#74b2fe", "#a0acd2", "#d199b0", "#f68392", "#8ccaa0"    
]

// ref: https://bl.ocks.org/vasturiano/12da9071095fbd4df434e60d52d2d58d
// ref : https://bl.ocks.org/kerryrodden/766f8f6d31f645c39f488a0befa1e3c8
// ref : https://beta.observablehq.com/@mbostock/d3-sunburst
// ref : http://bl.ocks.org/sathomas/4a3b74228d9cb11eb486