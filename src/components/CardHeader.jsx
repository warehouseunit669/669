import CardOverflow from "@mui/joy/CardOverflow";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import React from "react";

export default function CardHeader(props) {
    return (
        <>
            <CardContent>
                <CardOverflow>
                    <Typography
                        fontWeight="lg"
                        sx={{
                            color: "#4E73DF",
                            direction: "rtl",
                            textAlign: "right",
                        }}
                    >
                        {props.title}
                    </Typography>
                </CardOverflow>
            </CardContent>
        </>
    );
}
