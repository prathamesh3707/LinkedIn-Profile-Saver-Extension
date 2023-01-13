import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

function Server() {
    const [data, setData] = useState("");
    useEffect(() => {
        const options = {
            method: "GET",
            url: "https://latest-stock-price.p.rapidapi.com/price",
            params: { Indices: "NIFTY 50" },
            headers: {
                "x-rapidapi-host": "latest-stock-price.p.rapidapi.com",
                "x-rapidapi-key": "c09849fc3amsh26fb9b0839137ebp1d85f5jsn3cfb7327cd13",
            },
        };

        axios
            .request(options)
            .then(function (response) {
                // console.log(response.data);
                setData(response.data);
            })
            .catch(function (error) {
                console.error(error);
            });
    }, [data, setData]);
    return (
        <div>
            {/* {data && JSON.stringify(data, null, 4)} */}
            {data &&
                data.map((obj) => (
                    <p>
                        <div>
                            <i>{obj.symbol}</i>
                        </div>
                        <div>
                            <div>Current Price :{obj.lastPrice}</div>
                            <div>Day High :{obj.dayHigh}</div>
                            <div>Day Low:{obj.dayLow}</div>
                        </div>
                    </p>
                ))}
            {!data && <h1>Loading...</h1>}
        </div>
    );
}

export default Server;
