// src/ibkr-spy-history.ts
const IB = require("ib");

const ib = new IB({
  host: "127.0.0.1",
  port: 7497,   // paper trading
  clientId: 2   // use a different ID than the first test
});

// --- SPY contract definition ---
const spyContract = {
  symbol: "SPY",
  secType: "STK",
  exchange: "SMART",
  currency: "USD",
  primaryExchange: "ARCA"
};

ib.on("connected", () => {
  console.log("✅ Connected to IBKR");

  ib.reqHistoricalData(
    1,                 // requestId
    spyContract,
    "",                // endDateTime ("" = now)
    "200 D",            // duration
    "1 day",            // bar size
    "TRADES",           // whatToShow
    1,                  // useRTH (1 = regular trading hours)
    1,                  // formatDate
    false               // keepUpToDate
  );
});

// Historical bar data
ib.on(
  "historicalData",
  (
    reqId: number,
    date: string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number
  ) => {
    console.log(`📊 ${date} | close: ${close}`);
  }
);


// End of data
ib.on("historicalDataEnd", () => {
  console.log("✅ Historical data received");
  ib.disconnect();
});

// Info + warnings (IBKR uses 'error' for status too)
ib.on("error", (err: any) => {
  console.log("ℹ️ IBKR:", err.message || err);
});

console.log("Connecting to IBKR...");
ib.connect();
