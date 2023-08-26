
// const ExcelJS = require('exceljs');
// const fs = require('fs/promises'); // Import fs with promises
// const path = require('path');
// const tf = require('@tensorflow/tfjs-node');

// async function loadDataFromExcel(filename) {
//   try {
//     const fileContent = await fs.readFile(filename); // Read the Excel file
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.load(fileContent);

//     const worksheet = workbook.worksheets[0]; // Assuming the data is on the first worksheet
//     const data = [];

//     worksheet.eachRow((row, rowNumber) => {
//       if (rowNumber > 1) {
//         data.push(row.values);
//       }
//     });

//     return data;
//   } catch (error) {
//     throw error;
//   }
// }

// async function main() {
//   try {

//     const pastInOutData = await loadDataFromExcel(path.join(__dirname, 'past_in_out_data.xlsx'));
//     const yardLocationsData = await loadDataFromExcel(path.join(__dirname, 'yard_locations.xlsx'));
//     const incomingContainersData = await loadDataFromExcel(path.join(__dirname, 'incoming_containers.xlsx'));


//     // Process and merge data, convert to TensorFlow tensors
//     // Build and train the model
//     // Make predictions

//       // Load other data files similarly
//       // Preprocess and merge data as needed
  
//       // Convert data to TensorFlow tensors
//       const inputFeatures = tf.tensor2d(pastInOutData.map(row => [row.CON_SIZE, row.Location, row.Area, row.Row, row.Bay, row.Level]), [pastInOutData.length, 6]);
//       const outputLabels = tf.tensor1d(pastInOutData.map(row => row.OUT_TIME));
  
//       // Create a linear regression model
//       const model = tf.sequential();
//       model.add(tf.layers.dense({ units: 1, inputShape: [6] }));
  
//       // Compile the model
//       model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });
  
//       // Train the model
//       model.fit(inputFeatures, outputLabels, { epochs: 100 }).then(info => {
//         console.log('Final loss:', info.history.loss[info.history.loss.length - 1]);
  
//         // Now you can use the trained model to make predictions
  
//         // For example, incoming container data
//         // Assuming you've loaded and preprocessed yardLocationsData similar to how you did for pastInOutData

// // For example, incoming container data
//         const incomingData = [
//             [20, 'LocationA', 'AreaA', 'RowA', 'BayA', 1],
//             // Add more incoming container data
//         ];
        
//         // Preprocess incoming data to match training data format
//         const incomingFeaturesPreprocessed = incomingData.map(row => [
//             row[0], // CON_SIZE
//             yardLocationsData.indexOf(row[1]), // Convert 'Location' to numerical representation
//             yardLocationsData.indexOf(row[2]), // Convert 'Area' to numerical representation
//             yardLocationsData.indexOf(row[3]), // Convert 'Row' to numerical representation
//             yardLocationsData.indexOf(row[4]), // Convert 'Bay' to numerical representation
//             row[5] // Level
//         ]);
        
//         const incomingFeaturesTensor = tf.tensor2d(incomingFeaturesPreprocessed, [incomingFeaturesPreprocessed.length, 6]);
        
//         // Make predictions
//         const predictedOutTimes = model.predict(incomingFeaturesTensor);
//         console.log(predictedOutTimes)
//         predictedOutTimes.print();
//       });

//     console.log('Data loaded and processed successfully.');
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// main();

// Import required libraries
const tf = require('@tensorflow/tfjs-node');
const Papa = require('papaparse');
const fs = require('fs');

const main = async (req, res, next) =>{

// Load CSV data using PapaParse
const locationsCSV = fs.readFileSync('/Users/mantragohil/Documents/code/Yarder/model/yard_locations.csv', 'utf8');
const pastInOutCSV = fs.readFileSync('/Users/mantragohil/Documents/code/Yarder/model/past_in_out.csv', 'utf8');


const locationsData = Papa.parse(locationsCSV, { header: true }).data;
const pastInOutData = Papa.parse(pastInOutCSV, { header: true }).data;
const incomingCSV = fs.readFileSync('/Users/mantragohil/Documents/code/Yarder/model/incoming_containers.csv', 'utf8');
const incomingData = Papa.parse(incomingCSV, { header: true }).data;
// Combine data based on common attributes
const combinedData = incomingData.map(incoming => {
  const matchingPastInOut = pastInOutData.find(past => past.CON_NUM === incoming.CON_NUM);
  const matchingLocation = locationsData.find(location => location.CON_NUM === incoming.CON_NUM);

  return {
    ...incoming,
    ...matchingPastInOut,
    ...matchingLocation,
  };
});

// Preprocess data and split into features (x) and labels (y)
const xData = [];
const yData = [];

combinedData.forEach(item => {
  const features = {
    ID: item.ID,
    IN_TIME: item.IN_TIME,
    REF_ID: item.REF_ID,
    CON_SIZE: item.CON_SIZE,
    STATUS: item.STATUS,
    // ... include other features
  };

  const label = item.CON_NUM;

  xData.push(features);
  yData.push(label);
});

const xTensor = tf.tensor2d(xData.map(item => Object.values(item)), null, 'float32');
const yTensor = tf.tensor2d(yData.map(label => [label]), null, 'float32');

// Normalize numerical features
const xMean = xTensor.mean(0);
const xStd = xTensor.sub(xMean).square().mean(0).sqrt();
const normalizedXData = xTensor.sub(xMean).div(xStd);

// Create a neural network model
const model = tf.sequential();
model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [normalizedXData.shape[1]] }));
model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1, activation: 'linear' }));

// Compile the model
model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

// Train the model
const epochs = 50;
const batchSize = 32;
await model.fit(normalizedXData, yTensor, { epochs, batchSize });
// Load CSV data using PapaParse

// Assuming you want to predict for the first incoming container in the data
const firstIncomingContainer = incomingData[0];

// Convert relevant attributes to numeric format
const incomingContainer = {
  ID: Number(firstIncomingContainer.ID),
  IN_TIME: Number(firstIncomingContainer.IN_TIME),
  REF_ID: Number(firstIncomingContainer.REF_ID),
  CON_SIZE: Number(firstIncomingContainer.CON_SIZE),
  STATUS: Number(firstIncomingContainer.STATUS),
  // ... include other features and convert them if needed
};

// Normalize incomingContainer features using the same mean and std
const normalizedIncomingFeatures = tf.tensor2d([Object.values(incomingContainer)])
  .sub(xMean)
  .div(xStd);

// Make predictions for incoming containers
const predictedContainerNum = model.predict(normalizedIncomingFeatures);
console.log(`Predicted Container Number: ${predictedContainerNum.dataSync()[0]}`);


}

main()