export const formatUrl = (fileUniqueName: string) => {
  let positionDernierPoint = fileUniqueName.lastIndexOf(".");
  if (positionDernierPoint !== -1) {
    let fileNameWithoutExtension = fileUniqueName.substring(
      0,
      positionDernierPoint,
    );
    return fileNameWithoutExtension;
  }
};
