
var w = 1000,
    h = 1000,
    fill = d3.scale.category20();

var vis = d3.select("#chart")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h);

function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return null;
  else
    return results[1];
}

type = gup("type")
if (type=="dirac") {
  var dataname = "graph_dirac.json",
    multiplier = 2000;
} else if (type=="sicp") {
  var dataname = "graph_sicp.json",
    multiplier = 1000;
} else {
  var dataname = "graph_dirac.json",
    multiplier = 2000;
}

d3.json(dataname, function(json) {
  var force = d3.layout.force()
      .charge(-120)
      .linkDistance(function(d) { return d.weight*multiplier; })
      .nodes(json.nodes)
      .links(json.links)
      .size([w, h])
      .start();

  var link = vis.selectAll("line.link")
      .data(json.links)
    .enter().append("svg:line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); })
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  // based on http://bl.ocks.org/mbostock/2706022
  var node = vis.selectAll(".node")
      .data(force.nodes())
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  // source or target properties match the hovered node.
  node.on('mouseover', function(d) {
      link.style('stroke-width', function(l) {
          if (d === l.source || d === l.target)
          return 3;
          else
          return 1;
      });
  });

  // Set the stroke width back to normal when mouse leaves the node.
  node.on('mouseout', function() {
      link.style('stroke-width', 1);
  });

  node.append("circle")
      .attr("r", 5)
      .style("fill", function(d) { return fill(d.group); })

  node.append("text")
      .attr("x", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    // Update the links
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    //gnodes.attr("cx", function(d) { return d.x; })
    //    .attr("cy", function(d) { return d.y; });

    node.attr("transform", function(d) { return 'translate(' + [d.x, d.y] + ')'; });
        });
    });
