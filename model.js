let model, maxPredictions;

async function loadModel() {
  const URL = "./model/";
  model = await tmImage.load(URL + "model.json", URL + "metadata.json");
  maxPredictions = model.getTotalClasses();
  console.log("Teachable Machine model loaded.");
  return model;
}
