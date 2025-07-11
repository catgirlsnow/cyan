const prefix = "&8[&3Cyan&8] ";


const units = {
    k: 1000,
    m: 1000000,
    b: 1000000000
  };
  

function convertToUnits(value) {
    let unit;
    let convertedValue;
  
    if (value >= 1000000000) {
      unit = 'b';
      convertedValue = value / units.b;
    } else if (value >= 1000000) {
      unit = 'm';
      convertedValue = value / units.m;
    } else {
      unit = 'k';
      convertedValue = value / units.k;
    }
  
    return convertedValue + unit;
  }
  

register("command", (amount) => {
    let numericValue = parseFloat(amount);
    let unit = amount.slice(-1).toLowerCase();
  
    if (isNaN(numericValue)) {
      ChatLib.chat(prefix + "&cInvalid Input");
      return;
    }
  
    let pretax;
    let listfee;
    let claimfee;
  
    if (!units.hasOwnProperty(unit)) {
      pretax = numericValue;
    } else {
      pretax = numericValue * units[unit];
    }
  
    if (pretax < 10000000) {
      listfee = pretax * 0.01;
    } else if (pretax < 100000000) {
      listfee = pretax * 0.02;
    } else {
      listfee = pretax * 0.025;
    }
  
    if (pretax < 1000000) {
      claimfee = 0;
    } else {
      claimfee = pretax * 0.01;
    }
  
    const convertedPretax = convertToUnits(pretax);
    const convertedListfee = convertToUnits(listfee);
    const convertedClaimfee = convertToUnits(claimfee);
  
    ChatLib.chat(prefix + "&aListing an item for &6" + convertedPretax)
    ChatLib.chat(prefix + "&aList Fee: &c" + convertedListfee)
    ChatLib.chat(prefix + "&aClaim Fee: &c" + convertedClaimfee)
    ChatLib.chat(prefix + "&aTotal Profit: &6" + convertToUnits(pretax - (listfee + claimfee)) )
  }).setName("calctax");