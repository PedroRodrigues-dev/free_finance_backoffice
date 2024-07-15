"use client";

import { Button, Chip, InputLabel, NativeSelect } from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import React, { Dispatch, SetStateAction } from "react";

interface ComponentProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  limitPerPage: number;
  setLimitPerPage: Dispatch<SetStateAction<number>>;
}

const CustomPagination: React.FC<ComponentProps> = ({
  page,
  setPage,
  limitPerPage,
  setLimitPerPage,
}) => {
  return (
    <div
      style={{
        margin: "16px",
        display: "flex",
        gap: "5px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        variant="text"
        size="small"
        onClick={() => {
          if (page > 1) {
            setPage(page - 1);
          }
        }}
      >
        <ArrowCircleLeftIcon sx={{ fontSize: "32px" }} />
      </Button>
      <Chip label={page} color="primary" variant="outlined" />
      <Button
        variant="text"
        size="small"
        onClick={() => {
          setPage(page + 1);
        }}
      >
        <ArrowCircleRightIcon sx={{ fontSize: "32px" }} />
      </Button>

      <NativeSelect
        defaultValue={limitPerPage}
        onChange={(e) => {
          setLimitPerPage(parseInt(e.target.value));
          setPage(1);
        }}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </NativeSelect>
    </div>
  );
};

export default CustomPagination;
