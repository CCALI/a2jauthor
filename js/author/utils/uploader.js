export function promptFile(fileType, fileHumanType) {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    if (fileType) {
      fileInput.accept = fileType;
    }
    fileInput.style = "display: none;";

    document.body.appendChild(fileInput);

    fileInput.onchange = function() {
      if (document.body.contains(fileInput)) {
        document.body.removeChild(fileInput);
      }

      const file = fileInput.files[0];
      if (!file) {
        return reject(new Error("No file selected"));
      }
      if (fileType && file.type !== fileType) {
        return reject(
          new Error(`File must be ${fileHumanType}, not "${file.type}"`)
        );
      }

      resolve(file);
    };

    fileInput.click();
  });
}
