/* Generated by Reason Relay Compiler, PLEASE EDIT WITH CARE */

type query = {
  id: string,
  name: string,
  married: bool,
  age: int,
  closeRate: float,
};

[@bs.module "./types.codec"]
external decodeResponse: Js.Json.t => query = "decodeResponse";