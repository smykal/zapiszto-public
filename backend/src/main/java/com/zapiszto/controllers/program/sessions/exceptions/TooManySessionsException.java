package com.zapiszto.controllers.program.sessions.exceptions;

public class TooManySessionsException extends RuntimeException {
  public TooManySessionsException(String message) {
    super(message);
  }
}
