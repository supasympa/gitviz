import * as d3 from 'd3';

// TODO: this whole file needs tests and refactoring!

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

        const calcFillColor = function(d: any) {

            let colors: any;
            const colorpicks = d3.interpolateHcl;
            const range = d3.range(0,10) as ReadonlyArray<unknown> as ReadonlyArray<string>; //WTF Typescript!?
            if (!d.parent) {
                colors = d3.scaleOrdinal(d3.schemeSet1).domain(range)
                d.color = "rgba(255, 255, 255, 0.25)";
            } else if (d.children) {
                const startColor = d3.hcl(d.color).darker(),
                    endColor   = d3.hcl(d.color).brighter();
                colors = d3.scaleLinear()
                        // @ts-ignore
                        .interpolate(colorpicks)
                        .range([
                            startColor.toString(),
                            endColor.toString()
                        ])
                        .domain([0,d.children.length+1]);
            }

            if (d.children) {
                d.children.map(function(child: any, i: any) {
                    return {value: child.value, idx: i};
                }).sort(function(a: any,b: any) {
                    return b.value - a.value
                }).forEach(function(child: any, i: any) {
                    d.children[child.idx].color = colors(i);
                });
            }

            return d.color;
        };        

        newSlice
            .append('path')
            .attr('class', 'main-arc')
            .style('fill', calcFillColor)
            .style('stroke', 'rgba(0, 0, 0, 0.15)')
            .style('stroke-width', 1)
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
            .style('stroke', 'rgba(255, 255, 255, 0.75)')
            .style('stroke-width', 5)
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

function buildHierarchy(csv: any) {
    const root = { name: 'root', children: [] };
    for (let i = 0; i < csv.length; i++) {
        const sequence = csv[i][0];
        const size = +csv[i][1];
        if (isNaN(size)) {
            // e.g. if this is a header row
            continue;
        }
        const parts = sequence.split('/');
        const currentNode = root;
        for (let j = 0; j < parts.length; j++) {
            const children = currentNode['children'];
            const nodeName = parts[j];
            let childNode;
            if (j + 1 < parts.length) {
                // Not yet at the end of the sequence; move down the tree.
                let foundChild = false;
                for (let k = 0; k < children.length; k++) {
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

// ref: https://bl.ocks.org/vasturiano/12da9071095fbd4df434e60d52d2d58d
// ref : https://bl.ocks.org/kerryrodden/766f8f6d31f645c39f488a0befa1e3c8
// ref : https://beta.observablehq.com/@mbostock/d3-sunburst
// ref : http://bl.ocks.org/sathomas/4a3b74228d9cb11eb486