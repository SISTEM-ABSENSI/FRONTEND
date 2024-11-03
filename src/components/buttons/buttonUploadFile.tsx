import * as React from "react";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SvgIconProps } from "@mui/material/SvgIcon";

interface ButtonFileUploadProps extends ButtonProps {
  buttonText?: string;
  icon?: React.ReactElement<SvgIconProps>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ButtonFileUpload: React.FC<ButtonFileUploadProps> = ({
  buttonText = "Upload file",
  variant = "contained",
  icon = <CloudUploadIcon />,
  inputProps,
  ...buttonProps
}) => {
  return (
    <Button
      component="label"
      role={undefined}
      variant={variant}
      startIcon={icon}
      {...buttonProps}
    >
      {buttonText}
      <VisuallyHiddenInput type="file" {...inputProps} />
    </Button>
  );
};

export default ButtonFileUpload;
