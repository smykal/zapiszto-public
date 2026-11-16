package com.zapiszto.controllers.card.dto;


import java.util.UUID;

public record CardDto (
  UUID id,
  String title,
  String description,
  String experience,
  String phone,
  String mail,
  String instagram,
  String www,
  Boolean online)
{}
