package com.zapiszto.controllers.dictionaries.dictCategory.exceptions;

import lombok.Getter;

@Getter
public class CategoryInUseException extends RuntimeException {

  private final long count;

  public CategoryInUseException(long count) {
    super("CATEGORY_IN_USE");
    this.count = count;
  }
}