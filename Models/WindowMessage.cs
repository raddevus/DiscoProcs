using System;

class WindowMessage{
  public WindowMessage(String command, String parameters)
  {
    this.Command = command;
        this.Parameters = parameters;
    this.AllParameters = parameters.Split(',',StringSplitOptions.RemoveEmptyEntries);
  }

  public String Command{get;set;}
  public String[] AllParameters{get;set;}

  public String Parameters{get;set;}
}