// // 使用 d3.json 异步加载 JSON 数据
// d3.json("assets/js/Donor_1_Zoommap_URL.json").then(data => {

//     // 图形的配置和创建过程
//     const width = 928;
//     const height = width;
//     const radius = width / 6;

//     const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

//     const hierarchy = d3.hierarchy(data)
//         .sum(d => d.value)
//         .sort((a, b) => b.value - a.value);
//     const root = d3.partition()
//         .size([2 * Math.PI, hierarchy.height + 1])
//         (hierarchy);
//     root.each(d => d.current = d);

//     const arc = d3.arc()
//         .startAngle(d => d.x0)
//         .endAngle(d => d.x1)
//         .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
//         .padRadius(radius * 1.5)
//         .innerRadius(d => d.y0 * radius)
//         .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

//     const svg = d3.select("#sunmap").append("svg")
//         .attr("viewBox", [-width / 2, -height / 2, width, height])
//         .style("font", "10px sans-serif");

//     // Append the arcs.
//     const path = svg.append("g")
//         .selectAll("path")
//         .data(root.descendants().slice(1))
//         .join("path")
//         .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
//         .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
//         .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")

//         .attr("d", d => arc(d.current));

//     // Make them clickable if they have children.
//     path.filter(d => d.children)
//         .style("cursor", "pointer")
//         .on("click", clicked);

//     const format = d3.format(",d");
//     path.append("title")
//         .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

//     const label = svg.append("g")
//         .attr("pointer-events", "none")
//         .attr("text-anchor", "middle")
//         .style("user-select", "none")
//         .selectAll("text")
//         .data(root.descendants().slice(1))
//         .join("text")
//         .attr("dy", "0.35em")
//         .attr("fill-opacity", d => +labelVisible(d.current))
//         .attr("transform", d => labelTransform(d.current))
//         .text(d => d.data.name);

//     const parent = svg.append("circle")
//         .datum(root)
//         .attr("r", radius)
//         .attr("fill", "none")
//         .attr("pointer-events", "all")
//         .on("click", clicked);

//     // Handle zoom on click.
//     function clicked(event, p) {
//         parent.datum(p.parent || root);

//         root.each(d => d.target = {
//             x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
//             x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
//             y0: Math.max(0, d.y0 - p.depth),
//             y1: Math.max(0, d.y1 - p.depth)
//         });

//         const t = svg.transition().duration(750);

//         // Transition the data on all arcs, even the ones that aren’t visible,
//         // so that if this transition is interrupted, entering arcs will start
//         // the next transition from the desired position.
//         path.transition(t)
//             .tween("data", d => {
//                 const i = d3.interpolate(d.current, d.target);
//                 return t => d.current = i(t);
//             })
//             .filter(function (d) {
//                 return +this.getAttribute("fill-opacity") || arcVisible(d.target);
//             })
//             .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
//             .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none")

//             .attrTween("d", d => () => arc(d.current));

//         label.filter(function (d) {
//             return +this.getAttribute("fill-opacity") || labelVisible(d.target);
//         }).transition(t)
//             .attr("fill-opacity", d => +labelVisible(d.target))
//             .attrTween("transform", d => () => labelTransform(d.current));
//     }

//     function arcVisible(d) {
//         return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
//     }

//     function labelVisible(d) {
//         return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
//     }

//     function labelTransform(d) {
//         const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
//         const y = (d.y0 + d.y1) / 2 * radius;
//         return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
//     }

//     return svg.node();
// }

// ).catch(error => console.error("Error loading the data: ", error));
// 使用 d3.json 异步加载 JSON 数据

d3.json("assets/js/Donor_1_Zoommap_URL.json").then(data => {
    // 图形的配置和创建过程
    const width = 928;
    const height = width;
    const radius = width / 6;

    const svg = d3.select("#sunmap").append("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .style("font", "10px sans-serif");

    // 定义一个颜色比例尺
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

    // 累积URLs的逻辑
    const accumulateURLs = (node) => {
        if (node.children) {
            node.children.forEach(child => accumulateURLs(child));
            node.URLs = node.children.flatMap(child => child.URLs || []);
        }
    };
    accumulateURLs(data);

    const hierarchy = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    const root = d3.partition()
        .size([2 * Math.PI, hierarchy.height + 1])
        (hierarchy);

    root.each(d => d.current = d);

    // 定义 arc 生成器
    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

// 定义浅灰色填充颜色
const lightGrey = "#8a8a8a"; // 浅灰色，可以根据需要调整颜色值

// 为每个有 URLs 的节点创建一个 pattern，并为没有 URLs 的节点设置浅灰色填充
root.descendants().forEach((d, i) => {
    if (d.data.URLs && d.data.URLs.length > 0) {
        const randomUrl = d.data.URLs[Math.floor(Math.random() * d.data.URLs.length)]; // 随机选择一个URL
        const patternId = `img-pattern-${i}`;

        svg.append("defs")
            .append("pattern")
            .attr("id", patternId)
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .append("image")
            .attr("height", 1)
            .attr("width", 1)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", randomUrl);

        d.patternId = patternId; // 存储 patternId 以供后续使用
    } else {
        d.patternId = null; // 确保没有 URLs 的节点没有 patternId
    }
});

    // 绘制路径并使用 pattern 填充
    const path = svg.append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("fill", d => d.patternId ? `url(#${d.patternId})` : lightGrey) // 有 URL 使用图片填充，无 URL 使用浅灰色
    .attr("fill-opacity", d => d.patternId ? 0.5 : 1) // 有 URL 的部分设置透明度为 50%，无 URL 的部分为不透明
    .attr("d", d => arc(d.current));


    // Make them clickable if they have children.
    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

    const format = d3.format(",d");
    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    const label = svg.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name);

    const parent = svg.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

    // Handle zoom on click.
    function clicked(event, p) {
        parent.datum(p.parent || root);

        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
        });

        const t = svg.transition().duration(750);

        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .filter(function (d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none")

            .attrTween("d", d => () => arc(d.current));

        label.filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));
    }

    function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    return svg.node();
}

).catch(error => console.error("Error loading the data: ", error));

function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
}
