const getInstrument = async () => {
  const instrument = await kc.getInstruments();
  // console.log(instrument)
  instrument.length > 0 &&
    console.log(
      JSON.stringify(
        instrument.filter(
          (e) =>
            e.tradingsymbol &&
            (e.tradingsymbol.startsWith("BANKNIFTY") ||
              e.tradingsymbol.startsWith("NIFTY") ||
              e.tradingsymbol.startsWith("CRUDEOILM")) &&
            e.instrument_type === "FUT"
        )
      )
    );
};
