package com.zapiszto.controllers.bodyParams.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum BmrCategory {
  SEDENTARY(1.2
      , "Mostly inactive or sedentary lifestyle"
      , "Mayormente inactivo o con un estilo de vida sedentario"
      , "Per lo più inattivo o con uno stile di vita sedentario"
      , "Przeważnie nieaktywny lub siedzący tryb życia"
      , "В основном неактивный или малоподвижный образ жизни"
      , "Переважно неактивний або сидячий спосіб життя"
  ),
  LIGHTLY_ACTIVE(1.375
      , "Fairly active (including walks and exercising 1–2 times per week)"
      , "Bastante activo (incluyendo caminatas y ejercicio 1–2 veces por semana)"
      , "Abbastanza attivo (incluse passeggiate ed esercizi 1–2 volte a settimana)"
      , "Dość aktywny (uwzględniając spacery i ćwiczenia 1–2 x na tydzień)"
      , "Довольно активный (включая прогулки и тренировки 1–2 раза в неделю)"
      , "Досить активний (враховуючи прогулянки та тренування 1–2 рази на тиждень)"
  ),
  MODERATELY_ACTIVE(1.55
      , "Moderately active (exercising 2–3 times per week)"
      , "Moderadamente activo (ejercicio 2–3 veces por semana)"
      , "Moderatamente attivo (esercizi 2–3 volte a settimana)"
      , "Umiarkowanie aktywny (ćwiczenia 2–3 x na tydzień)"
      , "Умеренно активный (тренировки 2–3 раза в неделю)"
      , "Помірно активний (тренування 2–3 рази на тиждень)"
  ),
  VERY_ACTIVE(1.725
      , "Active (intense exercise more than 3 times per week)"
      , "Activo (ejercicio intenso más de 3 veces por semana)"
      , "Attivo (allenamenti intensi più di 3 volte a settimana)"
      , "Aktywny (ostre ćwiczenia ponad 3 x w tygodniu)"
      , "Активный (интенсивные тренировки более 3 раз в неделю)"
      , "Активний (інтенсивні тренування понад 3 рази на тиждень)"
  ),
  EXTRA_ACTIVE(1.9
      , "Very active (intense exercise every day)"
      , "Muy activo (ejercicio intenso todos los días)"
      , "Molto attivo (allenamenti intensi ogni giorno)"
      , "Bardzo aktywny (codziennie ostre ćwiczenia)"
      , "Очень активный (интенсивные тренировки каждый день)"
      , "Дуже активний (щоденні інтенсивні тренування)"
  );

  private final double activityCoefficient;
  private final String descriptionEN;
  private final String descriptionES;
  private final String descriptionIT;
  private final String descriptionPL;
  private final String descriptionRU;
  private final String descriptionUA;

}
