import axios from 'axios'

//Chain address prefixes
const prefix = {
    prime: {
      low: 0x00,
      high: 0x09,
    },
    region_1: {
      low: 0x0a,
      high: 0x13,
    },
    region_2: {
      low: 0x14,
      high: 0x1d,
    },
    region_3: {
      low: 0x1e,
      high: 0x27,
    },
    zone_1_1: {
      low: 0x28,
      high: 0x31,
    },
    zone_1_2: {
      low: 0x32,
      high: 0x3b,
    },
    zone_1_3: {
      low: 0x3c,
      high: 0x45,
    },
    zone_2_1: {
      low: 0x46,
      high: 0x4f,
    },
    zone_2_2: {
      low: 0x50,
      high: 0x59,
    },
    zone_2_3: {
      low: 0x5a,
      high: 0x63,
    },
    zone_3_1: {
      low: 0x64,
      high: 0x6d,
    },
    zone_3_2: {
      low: 0x6e,
      high: 0x77,
    },
    zone_3_3: {
      low: 0x6e,
      high: 0x81,
    },
};

//Returns the chain from a given address
export async function GetChainfromAddress (address){
    var addressprefix = parseInt(address.substring(0,4), 16);
    //Check if current address prefix is in any of the chains
    for (var name in prefix){
        if (addressprefix >= prefix[name]['low'] && addressprefix <= prefix[name]['high']){
          console.log(name);
          console.log("here");
          return name;
        }
    }
    console.log("Current address " + address +" cannot be assosicated with any of the chains");
    return null;
}

export async function GetMissingTransactions (client, info, transactions) {
    console.log(info, transactions)
}