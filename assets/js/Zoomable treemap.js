// 异步加载数据并创建图表
async function loadAndCreateTreemap() {
    try {
        // 加载数据
        const response = await fetch('assets/js/Treemap_Donor.json');
        const data = await response.json();

        // 创建图表
        createTreemap(data);
    } catch (error) {
        console.error('Error loading the JSON file:', error);
    }
}

function createTreemap(data) {
    // Specify the chart’s dimensions.
    const width = 928;
    const height = 924;

    // This custom tiling function adapts the built-in binary tiling function
    // for the appropriate aspect ratio when the treemap is zoomed-in.
    function tile(node, x0, y0, x1, y1) {
        d3.treemapBinary(node, 0, 0, width, height);
        for (const child of node.children) {
            child.x0 = x0 + (child.x0 / width) * (x1 - x0);
            child.x1 = x0 + (child.x1 / width) * (x1 - x0);
            child.y0 = y0 + (child.y0 / height) * (y1 - y0);
            child.y1 = y0 + (child.y1 / height) * (y1 - y0);
        }
    }

    // Compute the layout.
    const hierarchy = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    const root = d3.treemap().tile(tile)(hierarchy);

    // Create the scales.
    const x = d3.scaleLinear().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([0, height]);

    // Formatting utilities.
    const format = d3.format(",d");
    const name = d => d.ancestors().reverse().map(d => d.data.name).join("/");

    // Create the SVG container.
    const svg = d3.select("#treemap").append("svg")
        .attr("viewBox", [0.5, -30.5, width, height + 30])
        .attr("width", width)
        .attr("height", height + 30)
        .attr("style", "max-width: 100%; height: auto; border: 1px solid black;")
        .style("font", "10px sans-serif");

    // Display the root.
    let group = svg.append("g")
        .call(render, root);

    function render(group, root) {
        console.log(root); // 查看root对象
        console.log(root.children); // 查看root的children属性

        const node = group
            .selectAll("g")
            .data(root.children ? root.children.concat(root) : [root]) // 如果root.children未定义，则使用[root]
            .join("g");

        node.filter(d => d === root ? d.parent : d.children)
            .attr("cursor", "pointer")
            .on("click", (event, d) => d === root ? zoomout(root) : zoomin(d));

        node.append("title")
            .text(d => `${name(d)}\n${format(d.value)}`);

        node.append("rect")
            .attr("fill", d => d === root ? "#fff" : d.children ? "#ccc" : "#ddd")
            .attr("stroke", "#fff");

        node.append("text")
            .attr("font-weight", d => d === root ? "bold" : null)
            .selectAll("tspan")
            .data(d => (d === root ? name(d) : d.data.name).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
            .join("tspan")
            .attr("x", 3)
            .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
            .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
            .attr("font-weight", (d, i, nodes) => i === nodes.length - 1 ? "normal" : null)
            .text(d => d);

        group.call(position, root);
    }

    function position(group, root) {
        group.selectAll("g")
            .attr("transform", d => d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`)
            .select("rect")
            .attr("width", d => d === root ? width : x(d.x1) - x(d.x0))
            .attr("height", d => d === root ? 30 : y(d.y1) - y(d.y0));
    }

    // When zooming in, draw the new nodes on top, and fade them in.
    function zoomin(d) {
        const group0 = group.attr("pointer-events", "none");
        const group1 = group = svg.append("g").call(render, d);

        x.domain([d.x0, d.x1]);
        y.domain([d.y0, d.y1]);

        svg.transition()
            .duration(750)
            .call(t => group0.transition(t).remove()
                .call(position, d.parent))
            .call(t => group1.transition(t)
                .attrTween("opacity", () => d3.interpolate(0, 1))
                .call(position, d));
    }

    // When zooming out, draw the old nodes on top, and fade them out.
    function zoomout(d) {
        const group0 = group.attr("pointer-events", "none");
        const group1 = group = svg.insert("g", "*").call(render, d.parent);

        x.domain([d.parent.x0, d.parent.x1]);
        y.domain([d.parent.y0, d.parent.y1]);

        svg.transition()
            .duration(750)
            .call(t => group0.transition(t).remove()
                .attrTween("opacity", () => d3.interpolate(1, 0))
                .call(position, d))
            .call(t => group1.transition(t)
                .call(position, d.parent));
    }
}

// 执行函数以加载数据并创建图表
loadAndCreateTreemap();

// async function loadAndCreateTreemap() {
//     try {
//         const response = await fetch('assets/js/Treemap_Donor.json');
//         const data = await response.json();
//         createTreemap(data);
//     } catch (error) {
//         console.error('Error loading the JSON file:', error);
//     }
// }

// function createTreemap(data) {
//     const width = 928;
//     const height = 924;

//     function tile(node, x0, y0, x1, y1) {
//         d3.treemapBinary(node, 0, 0, width, height);
//         for (const child of node.children) {
//             child.x0 = x0 + (child.x0 / width) * (x1 - x0);
//             child.x1 = x0 + (child.x1 / width) * (x1 - x0);
//             child.y0 = y0 + (child.y0 / height) * (y1 - y0);
//             child.y1 = y0 + (child.y1 / height) * (y1 - y0);
//         }
//     }

//     const hierarchy = d3.hierarchy(data)
//         .sum(d => d.value)
//         .sort((a, b) => b.value - a.value);
//     const root = d3.treemap().tile(tile)(hierarchy);

//     const x = d3.scaleLinear().rangeRound([0, width]);
//     const y = d3.scaleLinear().rangeRound([0, height]);

//     const format = d3.format(",d");
//     const name = d => d.ancestors().reverse().map(d => d.data.name).join("/");

//     const svg = d3.select("#treemap").append("svg")
//         .attr("viewBox", [0.5, -30.5, width, height + 30])
//         .attr("width", width)
//         .attr("height", height + 30)
//         .attr("style", "max-width: 100%; height: auto; border: 1px solid black;")
//         .style("font", "10px sans-serif");

//     let group = svg.append("g")
//         .call(render, root);

//     function render(group, root) {
//         const node = group
//             .selectAll("g")
//             .data(root.children ? root.children.concat(root) : [root])
//             .join("g");

//         node.filter(d => d === root ? d.parent : d.children)
//             .attr("cursor", "pointer")
//             .on("click", (event, d) => d === root ? zoomout(root) : zoomin(d));

//         node.append("title")
//             .text(d => `${name(d)}\n${format(d.value)}`);

//         // Define patterns for image fills
//         node.each(function(d) {
//             if (d.data.image) { // Check if the node has an image property
//                 const patternId = `pattern-${d.data.name.replace(/[^a-zA-Z0-9]/g, '-')}`; // Create a unique ID for the pattern
//                 const pattern = svg.append("defs")
//                     .append("pattern")
//                     .attr("id", patternId)
//                     .attr("patternUnits", "objectBoundingBox")
//                     .attr("width", 1)
//                     .attr("height", 1);

//                 pattern.append("image")
//                     .attr("xlink:href", d.data.image)
//                     .attr("width", d.x1 - d.x0)
//                     .attr("height", d.y1 - d.y0)
//                     .attr("preserveAspectRatio", "xMidYMid slice");

//                 d3.select(this).select("rect").attr("fill", `url(#${patternId})`);
//             }
//         });

//         node.append("rect")
//             .attr("fill", d => d === root ? "#fff" : d.children ? "#ccc" : "#ddd")
//             .attr("stroke", "#fff");

//         node.append("text")
//             .attr("font-weight", d => d === root ? "bold" : null)
//             .selectAll("tspan")
//             .data(d => (d === root ? name(d) : d.data.name).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
//             .join("tspan")
//             .attr("x", 3)
//             .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
//             .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
//             .attr("font-weight", (d, i, nodes) => i === nodes.length - 1 ? "normal" : null)
//             .text(d => d);

//         group.call(position, root);
//     }

//     function position(group, root) {
//         group.selectAll("g")
//             .attr("transform", d => d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`)
//             .select("rect")
//             .attr("width", d => d === root ? width : x(d.x1) - x(d.x0))
//             .attr("height", d => d === root ? 30 : y(d.y1) - y(d.y0));
//     }

//     function zoomin(d) {
//         const group0 = group.attr("pointer-events", "none");
//         const group1 = group = svg.append("g").call(render, d);

//         x.domain([d.x0, d.x1]);
//         y.domain([d.y0, d.y1]);

//         svg.transition()
//             .duration(750)
//             .call(t => group0.transition(t).remove()
//                 .call(position, d.parent))
//             .call(t => group1.transition(t)
//                 .attrTween("opacity", () => d3.interpolate(0, 1))
//                 .call(position, d));
//     }

//     function zoomout(d) {
//         const group0 = group.attr("pointer-events", "none");
//         const group1 = group = svg.insert("g", "*").call(render, d.parent);

//         x.domain([d.parent.x0, d.parent.x1]);
//         y.domain([d.parent.y0, d.parent.y1]);

//         svg.transition()
//             .duration(750)
//             .call(t => group0.transition(t).remove()
//                 .attrTween("opacity", () => d3.interpolate(1, 0))
//                 .call(position, d))
//             .call(t => group1.transition(t)
//                 .call(position, d.parent));
//     }
// }

// loadAndCreateTreemap();
