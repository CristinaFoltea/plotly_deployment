
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
    optionChanged(sampleNames[0])
  })}

function optionChanged(value) {
  d3.json("samples.json").then((data) => {
    console.log(data)
    buildMetadata(data.metadata, value);
    buildCharts(data.metadata, data.samples, value);
  })
}

function buildMetadata(metadata, id) {
  var resultArray = metadata.filter(sampleObj => sampleObj.id == id);
  var result = resultArray[0];
  var PANEL = d3.select("#sample-metadata");
  PANEL.html("");
  Object.entries(result).forEach(([key, value]) => {
    PANEL.append("h6").text(`${key}: ${value}`);
  })
}

function buildCharts(metadata, samples, id) {
    const meta = metadata.filter( m => m.id == id)[0]
    const sample = samples.filter( sample => sample.id === id)[0]
    buildSpeciesChart(sample)
    buildWashingFrequencyChart(meta.wfreq)
    buildFrequencyBubbleChart(sample)
}

function buildSpeciesChart(sample) {
  const ids = sample.otu_ids.slice(0, 10).reverse()
  const values = sample.sample_values.slice(0, 10).reverse()
  const chartData = {
    x: values,
    y: ids.map( id => `OTU ${id}`),
    type: "bar",
    orientation: 'h',
    marker: {
      color: '#6E7A74'
    }
  }
  const layout = {
    title: "<b>Top Bacterial Species</b>"
  }
  Plotly.newPlot("bar", [chartData], layout)
}

function buildWashingFrequencyChart(frequence = 0) {
  const baseArray = Array.from(new Array(9).keys())
  // Trig to calc meter point
  var degrees = 180-(180/9*frequence),
      radius = .6;

  var x = radius * Math.cos(degrees * Math.PI / 180);
  var y = radius * Math.sin(degrees * Math.PI / 180);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{
    x: [0], y:[0],
      marker: {size: 28, color:'#9E2D2F'},
      showlegend: false,
      name: 'times per week',
      text: frequence,
      hoverinfo: 'text+name'},
    { values: [180/9,180/9,180/9,180/9,180/9,180/9,180/9,180/9,180/9,180 ],
    rotation: 90,
    text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
    textinfo: 'text',
    textposition:'inside',
    marker: {
      colors: [...baseArray.map(number => `rgba(32, 122, 57, ${(number + 1) / 10})`).reverse(), 'rgba(0, 0, 0, 0)']
    },
    labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
        type: 'path',
        fillcolor: '#9E2D2F',
        path,
        line: {
          color: '#9E2D2F'
        }
      }],
    title: '<b>Belly Button Washing frequency</b> <br> Scrubs per week',
    height: 500,
    width: 500,
    xaxis: {visible: false, range: [-1, 1]},
    yaxis: {visible:false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', data, layout);
}

function buildFrequencyBubbleChart(sample) {
  const data = {
    x: sample.otu_ids,
    y: sample.sample_values.map(v => parseInt(v)),
    text: sample.otu_labels,
    mode: 'markers',
    marker: {
      size: sample.sample_values.map(v => parseInt(v)*0.5),
      color: sample.otu_ids.map(id => {
        if (id < 400 ) return "#207A39";
        if (id < 800) return "#91AB98";
        if (id < 1600) return "#87E6A1"
        if (id < 2400) return "#9E2D2F"
        return "#C29596"
      }),
    }
  }
  const layout = {
    title: "<b>Frequency of all bacterial species</b>",
    xaxis: {
      title: "OTU ID",
    }
  }
  Plotly.newPlot("bubble", [data], layout)
}

init();