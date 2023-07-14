export default function getModelFamily(model: string) {
  if (model) {
    const modelVersion = model?.split(" ")[1]?.split(".")[0]?.charAt(1);
    return model && model.startsWith("QI-Core")
      ? `FHIR${modelVersion}`
      : `${model?.split(" ")[0]}${modelVersion}`;
  }
}
