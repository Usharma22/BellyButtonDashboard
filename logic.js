function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var subjectIds = data.names;
     subjectIds.forEach((id) => {
        selector
          .append("option")
          .text(id)
          .property("value", id);
      });
       const sampleNames = subjectIds[0];
      buildMetadata(sampleNames[0]);
      buildCharts(sampleNames[0]);
      
   
  
  // Use the first subject ID from the names to build initial plots
  //  const firstSubject = subjectIds[0];
  //  updateCharts(firstSubject);
  //  updateMetadata(firstSubject);
    });
    }
 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      Object.entries(result).forEach(([key,value]) => {PANEL.append("h6").text(`${key}:${value}`)}) 
      // PANEL.append("h6").text(result.location);
    });

  }

  function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var sampley = data.samples;
      var resultArray = sampley.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
       var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
      var  metadatay = metadataArray[0];

      var frequency = parseFloat(metadatay.wfreq);

      

      // //      -------------for bar chart-----------------------------
        data = [{
          x: result.sample_values.slice(0,10).reverse(),
          y: result.otu_ids.slice(0,10).map(id => `otu ${id}`).reverse(),
          text: result.otu_labels.slice(0,10).reverse(),
          type: "bar",
          orientation: "h"
        }];

        var layout = {
          title: "Top Ten OTUs for Individual " +sample,
          margin: {l: 100, r: 100, t: 100, b: 100}
      };

        Plotly.newPlot("bar", data, layout);
        //  // Use Plotly to plot the bubble data and layout.-------------------
        data = [{
          x: result.otu_ids,
          y: result.sample_values,
          text: result.otu_labels,
          mode: "markers",
        marker: {size : result.sample_values , color: result.otu_ids 
        }  
        }];

        var layout = {
          title: 'Bacteria Cultures per Sample',
          showlegend: false,
          hovermode: 'closest',
          xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
          margin: {t:30}
        };

          Plotly.newPlot("bubble", data, layout);
        // 5. Create the layout for the gauge chart-------------------------------

          //     // Data for Gauge Chart
          data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              // marker: {size: 28, color:'850000'},
              value: frequency,
              title: 'Belly Button Washing Frequency<br> Scrubs per Week',
              //  below code provides a simple gauge
              // titlefont: {family: '"Palatino Linotype", "Book Antiqua", Palatino, serif'},
              titlefont: {family: '"Arial, Helvetica, sans-serif'},
              type: "indicator",
              // gauge: { axis: { visible: true, range: [0, 9] } },
              mode: "gauge+number",
              gauge: {
                axis: { range: [null, 9] },
                steps: [
                  { range: [0, 1], color: 'rgb(248, 243, 236)' },
                  { range: [1, 2], color: 'rgb(244, 241, 229)' },
                  { range: [2, 3], color: 'rgb(233, 230, 202)' },
                  { range: [3, 4], color: 'rgb(229, 231, 179)' },
                  { range: [4, 5], color: 'rgb(213, 228, 157)' },
                  { range: [5, 6], color: 'rgb(183, 204, 146)' },
                  { range: [6, 7], color: 'rgb(140, 191, 136)' },
                  { range: [7, 8], color: 'rgb(138, 187, 143)' },
                  { range: [8, 9], color: 'rgb(133, 180, 138)' },
                ],
              }
            }
          ];
          
          var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
           //   }
          // ];
          // // Layout for Gauge Chart

          // var layout = {
          //   width: 600,
          //   height: 400,
          //   margin: { t: 25, r: 25, l: 25, b: 25 },
          //   line: {
          //   color: '600000'
          //   },
          //   // paper_bgcolor: "#a5bdc6",
          //   font: { color: "#49a81d", family: "Arial, Helvetica, sans-serif" }
          // };

        // 6. Use Plotly to plot the gauge data and layout.
         Plotly.newPlot("gauge", data, layout);  
          
        });
       }

       function optionChanged(newSample) {
        // getting new sample everytime
        buildMetadata(newSample);
        buildCharts(newSample);
           
      }
        // initalize dashboard
       init();
  