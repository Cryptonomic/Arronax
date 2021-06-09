import * as d3 from "d3";

export class chartGenerator {
    static seperateAxisPrioritizedBarChartGenerator(height: number, width: number, graphSVGElement: any, queryResult: any, xAxisKey: string, yAxisKey: string, barColor:string = "rgba(135, 194, 205, 0.58639)", labelX: string, labelY: string, spacing: number, hasLabel:boolean, stroke: string = "#56C2D9") {
        // Clear SVG Elements of old data
        graphSVGElement.selectAll("*").remove();

        const margin = { top: 0, right: 50, bottom: 50, left: 0 };

        // Create an Array for each Axis
        let xAxisData: any = queryResult.map((d: any) => (d as any)[xAxisKey]);
        const yAxisData = queryResult.map((d: { [x: string]: string; }) => parseInt(d[yAxisKey]));

        // Create a D3 Linear Scale for the Y-Axis
        const yScale = d3.scaleLinear()
            .domain([0, d3.max<any>(yAxisData)])
            .range([0, height]);

        // Create a D3 Linear Scale for the Y-Axis Label
        // We negate the height here so that the bars are drawn correctly
        // const yAxisScale: any = d3.scaleLinear<string>()
        //     .domain([0, d3.max<any>(yAxisData)])
        //     .range(([0, -height] as any));

        // Create a D3 Band Scale for the X-Axis
        // A static SVG will have a fixed size no matter the number of elements
        // Here, the width parameter is treated as the width of each bar in the graph
        let range: any = d3.range(xAxisData.length);
        let xScale = d3.scaleBand()
            .domain(range)
            .range([0, width]);

        // Setup SVG element attributes
        graphSVGElement
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
            .attr("font-family", "roboto")
            .attr("color", "#6A707E")
            .attr("font-size", "12")
            .attr("font-weight", "500")
            .attr("text-anchor", "end");

        if (xScale.bandwidth() <= 1) {
            let rangeData: any = d3.range(xAxisData.length)
            xScale = d3.scaleBand()
                .domain(rangeData)
                .range([0, xAxisData.length * 3]);

            // Set up SVG element for graph
            graphSVGElement
                .attr("height", height)
                .attr("width", xScale.range()[1] + 25)
                .attr("font-family", "roboto")
                .attr("font-size", "12")
                .attr("font-weight", "500")
                .attr("text-anchor", "end");
        }

        let x = (width + margin.left + margin.right+45)/2
        if(hasLabel) {
            x = width/2 +24;
        }

        // X axis Label
        graphSVGElement.append("text")
            .attr("class", "x label")
            .attr("color", "#6A707E")
            .attr("text-anchor", "end")
            .attr("font-family", "Roboto")
            .attr("font-weight", "500")
            .attr("font-size", "12px")
            .attr("x", x)
            .attr("y", height +30)
            .style("text-align", "center")
            .text(labelX);

        // Y axis Label
        graphSVGElement.append("text")
            .attr("class", "y label")
            .attr("color", "#6A707E")
            .attr("font-family", "Roboto")
            .attr("font-weight", "500")
            .attr("font-size", "12px")
            .attr("x", -115)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .style("text-align", "center")
            .text(labelY);

        // Create selection for bar graph bars
        const bar = graphSVGElement.selectAll("g")
            .data(yAxisData) //Attach bars to Y-Axis data
            .join("g")
                .attr("transform", (d: any, i: any) => `translate(${xScale(i)}, ${height - yScale(d)})`);

        bar.append("rect")
            .style("stroke-width", "1")
            .style("stroke", stroke)
            .attr("fill", barColor)
            .attr("width", xScale.bandwidth() - spacing) // Sets a padding of five pixel between bars
            .attr("height", yScale);
    }

    static axisGenerator(axisSVGElement: any, height: number, queryResult: any, yAxisKey: string, labelY: string, axisWidth: number=70) {
        axisSVGElement.selectAll("*").remove();

        const yAxisData = queryResult.map((d: { [x: string]: string; }) => parseInt(d[yAxisKey]));

        const max = d3.max<any>(yAxisData) + 5;
        const yAxisScale: any = d3.scaleLinear<string>()
            .domain([-5, max])
            .range(([0, -height] as any));

        // Create a Y-Axis Scale
        const yAxis = d3.axisLeft(yAxisScale)
        .scale(yAxisScale).ticks(6);

        // Prepare the Y-Axis Element
        axisSVGElement
            .attr("height", height)
            .attr("width", axisWidth)
            .attr("class", "y-axis");

        axisSVGElement.append("text")
            .attr("class", "y label")
            .attr("color", "#6A707E")
            .attr("text-anchor", "end")
            .attr("font-family", "Roboto")
            .attr("font-weight", "500")
            .attr("font-size", "12px")
            .attr("x", -95)
            .attr("y", 10)
            .attr("transform", "rotate(-90)")
            .text(labelY);

        // Attach the axis to the SVG Element
        axisSVGElement
            .append("g")
            .attr("transform", `translate(${axisWidth}, ${height})`)
            .style("color", "#6A707E")
            .style("font-size", "14px")
            .style("font-weight", "500")
            .style("font-family", "roboto")
            .call(yAxis);
    }
    static barGraphFloatingTooltipGenerator(graphSVGElement: any, xLabelFunction: Function, yLabelFunction: Function) {
        //Select all bar graph bar elements
        const bar = graphSVGElement.selectAll("g")

        // Set up tooltip for graph data viewing
        const tooltip = d3.select("body").append("div").attr("class", "graphToolTip");

        // Add event listener for tooltip
        bar.on("mousemove", function(d: any, i: number) {
            tooltip
                .style("left", d.pageX + 20 + "px")
                .style("top", d.pageY - 70 + "px")
                .style("display", "inline-block")
                .style("position", "absolute")
                .style("text-align", "center")
                .style("background", "#313C4E")
                .style("box-shadow", "1.5px 2.5px 4px rgba(119, 119, 119, 0.25)")
                .style("font-family", "Roboto")
                .style("font-size", "9.5px")
                .style("line-height", "15px")
                .style("letter-spacing", "0.4px")
                .style("color", "#ffffff")
                .style("padding", "5px 20px")
                .html(yLabelFunction(i, i) + "<br>" + xLabelFunction(i, i));
        })
            .on("mouseout", function(d: any){ tooltip.style("display", "none");
        });
    }
}
