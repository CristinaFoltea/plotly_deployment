
function init() {
  var selector = d3.select("#selDataset");
  
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
      .append("option")
      .text(sample)
      .property("value", sample);
    });
    buildMetadata(sampleNames[0])
  })}

function optionChanged(value) {
  buildMetadata(value);
  buildCharts(value);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result)
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    })
  });
}

init();