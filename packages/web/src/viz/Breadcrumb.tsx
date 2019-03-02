import { FunctionComponent, default as React } from 'react';

export interface BreadcrumbProps {
    path: string[];
}

export const Breadcrumb: FunctionComponent<BreadcrumbProps> = (props: BreadcrumbProps) => (
    <ol className="breadcrumb">{props.path.map((pp: string, i: number) => (<li key={`path_${i+1}`} className={`path_${i+1} breadcrumb-item`}><a href="#">{pp}</a></li>))}</ol>
);