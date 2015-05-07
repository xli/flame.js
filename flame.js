function flamegraph(element, width, height, root, label) {
  var color = d3.scale.category20c();
  var svg = d3.select(element).append("svg")
    .attr("width", width)
    .attr("height", height);
  var b = svg.node().getBoundingClientRect();
  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.linear().range([0, height]);

  var partition = d3.layout.partition()
    .sort(null)
    .value(function(d) { return d.size; });
  var pnodes = partition.nodes(root)
  var nodes = svg.selectAll("rect")
    .data(pnodes)
    .enter().append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(1-d.y-d.dy); })
    .attr("width", function(d) { return x(d.dx); })
    .attr("height", function(d) { return y(d.dy); })
    .style("fill", function(d) { return color(d.name); })
    .on("mouseover", function(d) {
      label.text((100*d.dx).toFixed(2) + "%:" + d.name);
    });

  var labels = svg.selectAll("text").data(pnodes)
    .enter().append("text")
    .attr("font-size", function(d) {return y(d.dy) - 2;})
    .attr("x", function(d) { return x(d.x) + 1; })
    .attr("y", function(d) { return y(1-d.y) - 1; })
    .text(function(d) {
      var title = d.name.split("/").pop();
      var len = x(d.dx) / (y(d.dy) - 2);
      if (len < 4) {
        return "";
      }
      if (title.length > len) {
        return title.substring(0, len - 2) + "..";
      }
      return title;
    });
  var zoomIn = function(d) {
    x.domain([d.x, d.x + d.dx]);
    y.domain([0, 1-d.y]).range([0, d.y ? height - 100 : height]);
    nodes.transition()
      .duration(750)
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(1-d.y-d.dy); })
      .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
      .attr("height", function(d) { return y(1-d.y) - y(1-d.y-d.dy); });

    labels.transition()
      .duration(750)
      .attr("x", function(d) { return x(d.x) + 1; })
      .attr("y", function(d) { return y(1-d.y) - 1; })
      .attr("font-size", function(d) {return y(d.dy) - 2;});
  };
  nodes.on("click", zoomIn);
  labels.on("click", zoomIn);
};
