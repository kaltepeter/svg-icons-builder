import {
  ConversionType,
  FileConversionOptions,
  ObjectConversionOptions,
  ConstantsConversionOptions,
} from "svg-to-ts/options/conversion-options";
import { error, info, success } from "svg-to-ts/helpers/log-helper";
import { convertToSingleObject } from "svg-to-ts/converters/object.converter";
import { convertToConstants } from "svg-to-ts/converters/constants.converter";
import { convertToFiles } from "svg-to-ts/converters/files.converter";

export type MessageData {
  isError: boolean;
  data: string
}

const sendParentProcessMessage = (msgData: { level: string; data: string }) => {
  const isError = msgData.level === "ERROR";  
  switch (msgData.level) {
    case "ERROR":
      error(msgData.data);
      break;
    case "SUCCESS":
      success(msgData.data);
      break;
    default:
      info(msgData.data);
  }

  if (process.send) {
    process.send({ isError, data: msgData.data } as MessageData);
  }
};

export const svgToTsWrapper = async (
  conversionOptions:
    | FileConversionOptions
    | ConstantsConversionOptions
    | ObjectConversionOptions
) => {
  if (conversionOptions.conversionType === ConversionType.FILES) {
    sendParentProcessMessage({
      level: "INFO",
      data: 'We are using the conversiontype "files"',
    });
    await convertToFiles(conversionOptions as FileConversionOptions);
  }

  if (conversionOptions.conversionType === ConversionType.CONSTANTS) {
    sendParentProcessMessage({
      level: "INFO",
      data: 'We are using the conversion type "constants"',
    });
    await convertToConstants(conversionOptions as ConstantsConversionOptions);
  }

  if (conversionOptions.conversionType === ConversionType.OBJECT) {
    sendParentProcessMessage({
      level: "INFO",
      data: 'We are using the conversion type "object"',
    });
    await convertToSingleObject(conversionOptions as ObjectConversionOptions);
  }
};

process.on("message", async (conversionOptions) => {
  try {
    await svgToTsWrapper(conversionOptions);
    sendParentProcessMessage({
      level: "SUCCESS",
      data: "svg-to-ts completed.",
    });
    process.disconnect();
    process.exit(0);
  } catch (err) {
    sendParentProcessMessage({ level: "ERROR", data: err.message });
    process.disconnect();
    process.exit(1);
  }
});

export default {}