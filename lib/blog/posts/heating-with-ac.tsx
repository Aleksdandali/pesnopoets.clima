import type { BlogPost } from "../types";

/* ------------------------------------------------------------------ */
/*  BG content                                                         */
/* ------------------------------------------------------------------ */
function ContentBG() {
  return (
    <>
      <h2>Защо Варна е идеална за отопление с климатик</h2>
      <p>
        Варна има мека зима. Средната температура през януари рядко пада под 2-3°C,
        а дни с минуси под -5°C се броят на пръсти — три-четири за цяла зима. Това
        прави инверторния климатик най-ефективния начин за отопление на жилище в
        крайбрежния град.
      </p>
      <p>
        За разлика от София или Пловдив, където зимите са по-сурови и хората разчитат
        на парно или газ, варненският климат позволява на един добър инверторен климатик
        да покрие 100% от нуждите за отопление. Без радиатори, без газ, без скъпа
        инфраструктура.
      </p>
      <p>
        Морският бриз поддържа относително стабилна температура — няма резки
        спадове. Когато в София е -15°C, във Варна е +2°C. Тази разлика е ключова
        за ефективността на климатика при отопление.
      </p>

      <h2>Как работи отоплението с инверторен климатик</h2>
      <p>
        Инверторният климатик не произвежда топлина като калорифер. Той я <strong>пренася</strong> —
        взима топлина от външния въздух и я вкарва вътре. Дори при 0°C навън във
        въздуха има достатъчно топлинна енергия, която климатикът може да извлече.
      </p>
      <p>
        Ключовият показател е <strong>COP</strong> (Coefficient of Performance). Добрият
        инверторен климатик има COP 3.5-4.5 при +7°C навън. На практика: за всеки 1 kW
        ток, който плащате, получавате 3.5-4.5 kW топлина. Калориферът ви дава точно
        1 kW топлина за 1 kW ток. Разликата е 3-4 пъти.
      </p>
      <p>
        При 0°C ефективността леко спада — COP пада до 2.5-3.0. При -5°C — до 2.0-2.5.
        Но дори при -5°C климатикът е два пъти по-ефективен от калорифера. А колко дни
        през зимата във Варна температурата пада под -5°C? Максимум три-четири.
      </p>
      <p>
        Сезонният показател <strong>SCOP</strong> отчита средната ефективност за целия
        отоплителен сезон. За Варна, където зимата е мека, реалният SCOP на добрите
        модели достига 4.5-5.0. За клас A+++ се изисква SCOP ≥ 5.1 — и много
        модели на Daikin и Mitsubishi го постигат.
      </p>

      <h2>Реални сметки за ток: колко струва отоплението</h2>
      <p>
        Да сметнем конкретно. Актуалните тарифи на ЕРП (EVN, Енерго-Про) за битови
        потребители:
      </p>
      <ul>
        <li><strong>Дневна тарифа:</strong> 0.248 лв/kWh (с ДДС)</li>
        <li><strong>Нощна тарифа:</strong> 0.069 лв/kWh (с ДДС, от 23:00 до 07:00)</li>
      </ul>
      <p>
        Нощната тарифа е почти 4 пъти по-евтина. Ако имате двутарифен електромер
        (а повечето апартаменти във Варна го имат), стратегията е проста: загрявате
        през нощта, а през деня поддържате.
      </p>

      <h3>Пример: апартамент 60 кв.м, инверторен 12000 BTU</h3>
      <p>Предположения:</p>
      <ul>
        <li>Панелен блок, средна изолация</li>
        <li>Желана температура: 21°C</li>
        <li>Средна температура навън: +3°C (януари, Варна)</li>
        <li>Среден COP за сезона: 3.5</li>
        <li>Средна необходима мощност: 2.0-2.5 kW топлинна</li>
      </ul>
      <p>
        При COP 3.5, за 2.0 kW топлинна мощност климатикът консумира ~0.57 kW ток.
        За 24 часа работа: 0.57 × 24 = 13.7 kWh на ден.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Сценарий</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">kWh/ден</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Цена/ден</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Цена/месец</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">Само дневна тарифа</td>
              <td className="text-right px-4 py-3 border border-border/60">13.7</td>
              <td className="text-right px-4 py-3 border border-border/60">3.40 лв</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">~102 лв</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Нощна тарифа (8 ч) + дневна (16 ч)</td>
              <td className="text-right px-4 py-3 border border-border/60">13.7</td>
              <td className="text-right px-4 py-3 border border-border/60">2.58 лв</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">~77 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Активно нощно + умерено дневно</td>
              <td className="text-right px-4 py-3 border border-border/60">11.0</td>
              <td className="text-right px-4 py-3 border border-border/60">1.85 лв</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">~56 лв</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Реалистичният диапазон за януари (най-студеният месец) е <strong>80-180 лв</strong>,
        в зависимост от изолацията, етажа и навиците. За ноември и март сметката е
        значително по-ниска — 40-80 лв.
      </p>
      <p>
        За целия отоплителен сезон (ноември-март) очаквайте <strong>300-700 лв общо</strong>.
        Сравнете с 1500-2500 лв за електрически калорифер за същия период.
      </p>

      <h2>Климатик срещу алтернативи: сравнителна таблица</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Уред</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Месечна сметка*</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Инвестиция</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Охлаждане</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Оценка</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-medium">Инверторен климатик</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-green-700">80-180 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">1800-3500 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">Да</td>
              <td className="text-center px-4 py-3 border border-border/60 font-bold text-green-700">Най-добър</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-medium">Електрически калорифер</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-red-700">250-500 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">50-200 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">Не</td>
              <td className="text-center px-4 py-3 border border-border/60 text-red-700">Скъпо</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-medium">Инфрачервен панел</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-amber-700">200-380 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">400-1200 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">Не</td>
              <td className="text-center px-4 py-3 border border-border/60 text-amber-700">Средно</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-medium">Подово отопление (ел.)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-red-700">300-550 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">2000-5000 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">Не</td>
              <td className="text-center px-4 py-3 border border-border/60 text-red-700">Скъпо</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        * За апартамент 60 кв.м, януари, Варна. Цените включват само електричество.
      </p>

      <h2>Какъв климатик да изберете за отопление</h2>
      <p>Не всеки климатик грее добре. Ето какво да търсите:</p>
      <ul>
        <li>
          <strong>SCOP ≥ 4.0</strong> — това е минимумът за ефективно отопление. Клас A++ или
          по-висок. Модели с SCOP 4.5+ ви спестяват осезаемо.
        </li>
        <li>
          <strong>Работа при -15°C</strong> — дори Варна понякога вижда -7°C. Искате резерв.
          Всички сериозни инверторни модели на Daikin, Mitsubishi и Gree работят до -15°C
          или -25°C.
        </li>
        <li>
          <strong>Правилен BTU за стаята</strong> — грешката &quot;по-голям = по-добър&quot; е скъпа.
          Преоразмереният климатик тактува (пали-гаси), губи ефективност и харчи повече.
        </li>
      </ul>

      <h3>Таблица: Препоръчителен BTU по квадратура</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Площ</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">BTU (охлаждане)</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">BTU (отопление)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">15-20 кв.м</td>
              <td className="text-center px-4 py-3 border border-border/60">7000-9000</td>
              <td className="text-center px-4 py-3 border border-border/60">9000-12000</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">20-30 кв.м</td>
              <td className="text-center px-4 py-3 border border-border/60">9000-12000</td>
              <td className="text-center px-4 py-3 border border-border/60">12000-14000</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">30-40 кв.м</td>
              <td className="text-center px-4 py-3 border border-border/60">12000-14000</td>
              <td className="text-center px-4 py-3 border border-border/60">14000-18000</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">40-60 кв.м</td>
              <td className="text-center px-4 py-3 border border-border/60">18000-24000</td>
              <td className="text-center px-4 py-3 border border-border/60">24000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        За отопление се препоръчва с 20-30% повече BTU спрямо охлаждането. Ако стаята е
        25 кв.м и на последен етаж — вземете 14000 BTU, не 12000.
      </p>

      <h2>Специфични съвети за Варна</h2>

      <h3>Крайбрежна влага и корозия</h3>
      <p>
        Варна е на морето. Солеността на въздуха ускорява корозията на външното тяло.
        Търсете модели с <strong>антикорозийно покритие</strong> на кондензатора (Golden Fin
        или Blue Fin). Daikin и Mitsubishi предлагат това в стандартните си серии.
        Евтините модели без защита започват да ръждясват за 2-3 години.
      </p>

      <h3>Панелни блокове и изолация</h3>
      <p>
        Повечето жилища във Варна са панелни (ЕПЖБ). Без външна изолация топлинните
        загуби са сериозни — до 40% повече в сравнение с изолирана сграда. Ако блокът
        ви не е санириан, оразмерете с 30% повече BTU и помислете за уплътняване
        на дограмата.
      </p>

      <h3>Стратегия с нощна тарифа</h3>
      <p>
        Загрявайте активно от 23:00 до 07:00 при нощна тарифа (0.069 лв/kWh). Задайте
        22-23°C през нощта. Сутрин намалете на 19-20°C — акумулираната топлина в стените
        и мебелите ще поддържа комфортна температура до обяд. Следобед, ако е слънчево,
        може изобщо да не палите.
      </p>
      <p>
        Разликата: 0.248 лв/kWh (ден) срещу 0.069 лв/kWh (нощ) — <strong>3.6 пъти по-евтино</strong>.
        Само чрез преместване на основното отопление към нощните часове спестявате 30-40%
        от месечната сметка.
      </p>

      <h2>Грешки, които ви костват пари</h2>

      <h3>Грешка 1: Температура 24-25°C</h3>
      <p>
        Всеки градус над 21°C увеличава консумацията с 6-8%. При 24°C плащате ~20%
        повече спрямо 21°C. Облечете пуловер и спестете 30-40 лв на месец.
      </p>

      <h3>Грешка 2: Отворени прозорци при работещ климатик</h3>
      <p>
        &quot;Да влезе малко въздух&quot; — и топлината излиза навън. Проветрявайте 5 минути с
        изключен климатик, после затворете и пуснете пак. Постоянно отвореният прозорец
        може да удвои сметката.
      </p>

      <h3>Грешка 3: Пропускане на годишната профилактика</h3>
      <p>
        Мръсни филтри, запушен кондензатор, недостатъчен фреон — всичко това намалява
        ефективността с 15-25%. Ежегодната профилактика струва 60-80 лв и се изплаща
        за месец. Климатик, който не е почистван 3 години, работи като уред от по-нисък
        клас.
      </p>

      <h3>Грешка 4: Включване-изключване вместо постоянна работа</h3>
      <p>
        Инверторният климатик е проектиран да работи постоянно при ниски обороти.
        Честото палене-гасене всъщност харчи повече ток отколкото постоянна работа
        при 21°C. Задайте температурата и го оставете.
      </p>

      <h2>Готови да изберете?</h2>
      <p>
        В нашия каталог ще намерите инверторни модели на Daikin, Mitsubishi и Gree,
        подходящи за отопление във Варна. Всички имат висок SCOP и антикорозийна защита.
      </p>
      <p>
        Не сте сигурни кой модел е за вас? Нашият AI консултант ще ви зададе няколко
        въпроса за стаята, бюджета и нуждите — и ще ви предложи конкретни модели с цени.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  RU content                                                         */
/* ------------------------------------------------------------------ */
function ContentRU() {
  return (
    <>
      <h2>Почему Варна идеальна для отопления кондиционером</h2>
      <p>
        Варна — это мягкая зима. Средняя температура в январе редко опускается ниже
        +2...+3°C, а дней с морозами ниже -5°C за всю зиму набирается три-четыре.
        Для тех, кто переехал из России или Украины, это звучит почти нереально — но
        это факт, который полностью меняет подход к отоплению.
      </p>
      <p>
        Центрального отопления в Варне нет. Газ подведен далеко не везде. Большинство
        квартир отапливается электричеством — и здесь инверторный кондиционер
        становится не просто удобным вариантом, а самым экономичным способом не
        мерзнуть зимой.
      </p>
      <p>
        Морской климат — это стабильность. Нет резких перепадов, нет неделей арктического
        холода. Когда в Москве -20°C, в Варне +3°C. Эта разница критична для
        эффективности теплового насоса, которым по сути является кондиционер.
      </p>

      <h2>Как работает отопление кондиционером (простыми словами)</h2>
      <p>
        Обычный обогреватель превращает электричество в тепло напрямую: 1 кВт тока =
        1 кВт тепла. Кондиционер работает иначе — он <strong>переносит</strong> тепло
        из наружного воздуха внутрь помещения. Даже при 0°C снаружи в воздухе
        достаточно тепловой энергии, чтобы её можно было &quot;выкачать&quot;.
      </p>
      <p>
        Ключевой показатель — <strong>COP</strong> (коэффициент производительности).
        Хороший инверторный кондиционер при +7°C на улице имеет COP 3.5-4.5. Это
        значит: за каждый 1 кВт электричества вы получаете 3.5-4.5 кВт тепла. В
        три-четыре раза эффективнее любого обогревателя.
      </p>
      <p>
        При 0°C COP снижается до 2.5-3.0. При -5°C — до 2.0-2.5. Но даже при -5°C
        кондиционер в два раза эффективнее масляного радиатора. А сколько дней в
        году в Варне бывает -5°C? Единицы.
      </p>
      <p>
        Сезонный показатель <strong>SCOP</strong> учитывает среднюю эффективность за
        весь отопительный сезон. Для Варны реальный SCOP хороших моделей достигает
        4.5-5.0. Daikin Perfera, Mitsubishi MSZ-AP — все они в этом диапазоне.
      </p>

      <h2>Реальные расходы на электричество: считаем в левах</h2>
      <p>Актуальные тарифы для бытовых потребителей в Болгарии:</p>
      <ul>
        <li><strong>Дневной тариф:</strong> 0.248 лв/кВтч (с НДС)</li>
        <li><strong>Ночной тариф:</strong> 0.069 лв/кВтч (с НДС, с 23:00 до 07:00)</li>
      </ul>
      <p>
        Ночной тариф — почти в 4 раза дешевле дневного. Двухтарифный счетчик
        есть в большинстве квартир. Если нет — поставить стоит ~50 лв, окупается
        за первый же месяц зимы.
      </p>

      <h3>Пример: квартира 60 м², инверторный 12000 BTU</h3>
      <p>Исходные данные:</p>
      <ul>
        <li>Панельный дом, средняя теплоизоляция</li>
        <li>Желаемая температура: 21°C</li>
        <li>Средняя температура на улице: +3°C (январь, Варна)</li>
        <li>Средний COP за сезон: 3.5</li>
        <li>Средняя потребляемая тепловая мощность: 2.0-2.5 кВт</li>
      </ul>
      <p>
        При COP 3.5 для выдачи 2.0 кВт тепла кондиционер потребляет ~0.57 кВт
        электричества. За 24 часа: 0.57 × 24 = 13.7 кВтч в день.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Сценарий</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">кВтч/день</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Цена/день</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Цена/месяц</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">Только дневной тариф</td>
              <td className="text-right px-4 py-3 border border-border/60">13.7</td>
              <td className="text-right px-4 py-3 border border-border/60">3.40 лв</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">~102 лв</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Ночной (8 ч) + дневной (16 ч)</td>
              <td className="text-right px-4 py-3 border border-border/60">13.7</td>
              <td className="text-right px-4 py-3 border border-border/60">2.58 лв</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">~77 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Активный ночной + умеренный дневной</td>
              <td className="text-right px-4 py-3 border border-border/60">11.0</td>
              <td className="text-right px-4 py-3 border border-border/60">1.85 лв</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">~56 лв</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Реалистичный диапазон для января: <strong>80-180 лв</strong> в зависимости от
        изоляции, этажа и привычек. В ноябре и марте — 40-80 лв.
      </p>
      <p>
        За весь отопительный сезон (ноябрь-март): <strong>300-700 лв</strong>.
        Для сравнения: масляный радиатор за тот же период — 1500-2500 лв.
      </p>

      <h2>Кондиционер против альтернатив: таблица сравнения</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Прибор</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">В месяц*</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Вложение</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Охлаждение</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Вердикт</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-medium">Инверторный кондиционер</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-green-700">80-180 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">1800-3500 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">Да</td>
              <td className="text-center px-4 py-3 border border-border/60 font-bold text-green-700">Лучший</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-medium">Масляный радиатор</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-red-700">250-500 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">50-200 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">Нет</td>
              <td className="text-center px-4 py-3 border border-border/60 text-red-700">Дорого</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-medium">Инфракрасная панель</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-amber-700">200-380 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">400-1200 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">Нет</td>
              <td className="text-center px-4 py-3 border border-border/60 text-amber-700">Средне</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-medium">Теплый пол (эл.)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-red-700">300-550 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">2000-5000 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">Нет</td>
              <td className="text-center px-4 py-3 border border-border/60 text-red-700">Дорого</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        * Для квартиры 60 м², январь, Варна. Только стоимость электричества.
      </p>

      <h2>Какой кондиционер выбрать для отопления</h2>
      <p>Не каждый кондиционер хорошо греет. Вот на что смотреть:</p>
      <ul>
        <li>
          <strong>SCOP ≥ 4.0</strong> — минимум для эффективного отопления. Это класс
          A++ и выше. Модели с SCOP 4.5+ дают ощутимую экономию.
        </li>
        <li>
          <strong>Работа при -15°C и ниже</strong> — даже в Варне бывает -7°C. Нужен
          запас. Daikin, Mitsubishi, Gree — все серьезные инверторные модели работают
          до -15°C или -25°C.
        </li>
        <li>
          <strong>Правильный BTU</strong> — больше не значит лучше. Переразмеренный
          кондиционер тактует (включается-выключается), теряет эффективность и
          потребляет больше.
        </li>
      </ul>

      <h3>Рекомендуемые BTU по площади</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Площадь</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">BTU (охлаждение)</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">BTU (отопление)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">15-20 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">7000-9000</td>
              <td className="text-center px-4 py-3 border border-border/60">9000-12000</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">20-30 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">9000-12000</td>
              <td className="text-center px-4 py-3 border border-border/60">12000-14000</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">30-40 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">12000-14000</td>
              <td className="text-center px-4 py-3 border border-border/60">14000-18000</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">40-60 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">18000-24000</td>
              <td className="text-center px-4 py-3 border border-border/60">24000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Для отопления нужно на 20-30% больше BTU, чем для охлаждения. Если комната
        25 м² на последнем этаже — берите 14000, а не 12000 BTU.
      </p>

      <h2>Советы специально для Варны</h2>

      <h3>Морская влажность и коррозия</h3>
      <p>
        Варна — морской город. Соленый воздух ускоряет коррозию внешнего блока.
        Ищите модели с <strong>антикоррозийным покрытием</strong> конденсатора (Golden
        Fin или Blue Fin). Daikin и Mitsubishi включают это в стандартную комплектацию.
        Дешевые модели без защиты начинают ржаветь через 2-3 года.
      </p>

      <h3>Панельные дома и теплоизоляция</h3>
      <p>
        Большинство жилья в Варне — панельные дома. Без внешнего утепления
        теплопотери на 30-40% выше, чем в утепленном здании. Если ваш дом не
        утеплен, закладывайте +30% по BTU и подумайте об уплотнении окон.
      </p>

      <h3>Стратегия с ночным тарифом</h3>
      <p>
        Активно грейте с 23:00 до 07:00 по ночному тарифу (0.069 лв/кВтч). Ставьте
        22-23°C на ночь. Утром снижайте до 19-20°C — тепло, накопленное в стенах и
        мебели, будет держать комфортную температуру до обеда. Днем, если солнечно,
        можно вообще не включать.
      </p>
      <p>
        Разница: 0.248 (день) vs 0.069 (ночь) — <strong>в 3.6 раза дешевле</strong>.
        Только за счет переноса основного отопления на ночь вы экономите 30-40%
        месячного счета.
      </p>

      <h2>Ошибки, которые стоят денег</h2>

      <h3>Ошибка 1: Температура 24-25°C</h3>
      <p>
        Каждый градус выше 21°C увеличивает расход на 6-8%. При 24°C вы платите
        ~20% больше, чем при 21°C. Наденьте свитер — сэкономите 30-40 лв в месяц.
      </p>

      <h3>Ошибка 2: Открытые окна при работающем кондиционере</h3>
      <p>
        &quot;Впустить свежий воздух&quot; — и тепло уходит на улицу. Проветривайте 5 минут
        с выключенным кондиционером, потом закрывайте и включайте. Постоянно
        приоткрытое окно может удвоить счет.
      </p>

      <h3>Ошибка 3: Пропуск ежегодного обслуживания</h3>
      <p>
        Грязные фильтры, забитый конденсатор, недостаток фреона — всё это снижает
        эффективность на 15-25%. Ежегодное ТО стоит 60-80 лв и окупается за первый
        же месяц зимы. Кондиционер, который не чистили 3 года, работает как прибор
        на класс ниже.
      </p>

      <h3>Ошибка 4: Включение-выключение вместо постоянной работы</h3>
      <p>
        Инверторный кондиционер спроектирован для постоянной работы на низких
        оборотах. Частое включение-выключение на самом деле потребляет больше
        электричества, чем постоянная работа при 21°C. Выставьте температуру и
        оставьте его работать.
      </p>

      <h2>Готовы выбрать?</h2>
      <p>
        В нашем каталоге — инверторные модели Daikin, Mitsubishi и Gree, подходящие
        для отопления в Варне. Все с высоким SCOP и антикоррозийной защитой.
      </p>
      <p>
        Не уверены, какая модель вам подходит? Наш AI консультант задаст несколько
        вопросов о комнате, бюджете и потребностях — и предложит конкретные модели
        с ценами.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  EN content                                                         */
/* ------------------------------------------------------------------ */
function ContentEN() {
  return (
    <>
      <h2>Why Varna Is Perfect for AC Heating</h2>
      <p>
        Varna has mild winters. The average January temperature hovers around
        +2...+3°C, and days below -5°C are rare — maybe three or four per winter.
        For expats used to cold European or North American winters, this changes
        everything about how you heat your home.
      </p>
      <p>
        There is no central heating in Varna. Gas is not widely available. Most
        apartments rely on electricity for heating — and an inverter air conditioner
        is by far the most cost-effective option. Not just convenient, but genuinely
        3-4x cheaper to run than a space heater.
      </p>
      <p>
        The Black Sea coastline keeps temperatures stable. No sudden drops to -20°C,
        no polar vortex weeks. When Sofia sees -15°C, Varna sits at +2°C. This
        consistency is what makes heat pump technology (which is what an AC really is)
        so effective here.
      </p>

      <h2>How Inverter AC Heating Works</h2>
      <p>
        A regular space heater converts electricity into heat directly: 1 kW of
        power = 1 kW of heat. An inverter AC works differently — it <strong>transfers</strong> heat
        from the outdoor air into your room. Even at 0°C, there is enough thermal
        energy in the air for the system to extract.
      </p>
      <p>
        The key metric is <strong>COP</strong> (Coefficient of Performance). A good
        inverter AC has a COP of 3.5-4.5 at +7°C outside. Meaning: for every 1 kW
        of electricity you pay for, you get 3.5-4.5 kW of heat. That is 3-4 times
        more efficient than any electric heater.
      </p>
      <p>
        At 0°C, COP drops to 2.5-3.0. At -5°C, it falls to 2.0-2.5. But even at
        -5°C, the AC is twice as efficient as a radiator. And how many days per
        winter does Varna see -5°C? A handful at most.
      </p>
      <p>
        The seasonal metric <strong>SCOP</strong> averages efficiency across the
        entire heating season. For Varna's mild climate, real-world SCOP of good
        models reaches 4.5-5.0. Daikin Perfera, Mitsubishi MSZ-AP — all in this
        range.
      </p>

      <h2>Real Electricity Costs: Doing the Math in BGN</h2>
      <p>Current residential electricity tariffs in Bulgaria:</p>
      <ul>
        <li><strong>Day rate:</strong> 0.248 BGN/kWh (incl. VAT)</li>
        <li><strong>Night rate:</strong> 0.069 BGN/kWh (incl. VAT, 23:00-07:00)</li>
      </ul>
      <p>
        The night rate is nearly 4x cheaper. Most apartments in Varna already have
        dual-tariff meters. If yours does not, installation costs about 50 BGN and
        pays for itself in the first month of winter.
      </p>

      <h3>Example: 60 m² apartment, inverter 12000 BTU</h3>
      <p>Assumptions:</p>
      <ul>
        <li>Panel building, average insulation</li>
        <li>Target temperature: 21°C</li>
        <li>Average outdoor temp: +3°C (January, Varna)</li>
        <li>Average seasonal COP: 3.5</li>
        <li>Average heating demand: 2.0-2.5 kW thermal</li>
      </ul>
      <p>
        At COP 3.5, to deliver 2.0 kW of heat the AC consumes ~0.57 kW of
        electricity. Over 24 hours: 0.57 x 24 = 13.7 kWh per day.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Scenario</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">kWh/day</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Cost/day</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Cost/month</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">Day rate only</td>
              <td className="text-right px-4 py-3 border border-border/60">13.7</td>
              <td className="text-right px-4 py-3 border border-border/60">3.40 BGN</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">~102 BGN</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Night (8h) + day (16h)</td>
              <td className="text-right px-4 py-3 border border-border/60">13.7</td>
              <td className="text-right px-4 py-3 border border-border/60">2.58 BGN</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">~77 BGN</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Active night + moderate day</td>
              <td className="text-right px-4 py-3 border border-border/60">11.0</td>
              <td className="text-right px-4 py-3 border border-border/60">1.85 BGN</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">~56 BGN</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Realistic range for January: <strong>80-180 BGN</strong> depending on
        insulation, floor level, and habits. November and March are significantly
        cheaper — 40-80 BGN.
      </p>
      <p>
        Full heating season (November-March): <strong>300-700 BGN total</strong>.
        Compare that to 1500-2500 BGN for a space heater over the same period.
      </p>

      <h2>AC vs Alternatives: Comparison Table</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Device</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Monthly cost*</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Investment</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Cooling</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Verdict</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-medium">Inverter AC</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-green-700">80-180 BGN</td>
              <td className="text-center px-4 py-3 border border-border/60">1800-3500 BGN</td>
              <td className="text-center px-4 py-3 border border-border/60">Yes</td>
              <td className="text-center px-4 py-3 border border-border/60 font-bold text-green-700">Best</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-medium">Electric heater</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-red-700">250-500 BGN</td>
              <td className="text-center px-4 py-3 border border-border/60">50-200 BGN</td>
              <td className="text-center px-4 py-3 border border-border/60">No</td>
              <td className="text-center px-4 py-3 border border-border/60 text-red-700">Expensive</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-medium">Infrared panel</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-amber-700">200-380 BGN</td>
              <td className="text-center px-4 py-3 border border-border/60">400-1200 BGN</td>
              <td className="text-center px-4 py-3 border border-border/60">No</td>
              <td className="text-center px-4 py-3 border border-border/60 text-amber-700">Average</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-medium">Underfloor heating (elec.)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-red-700">300-550 BGN</td>
              <td className="text-center px-4 py-3 border border-border/60">2000-5000 BGN</td>
              <td className="text-center px-4 py-3 border border-border/60">No</td>
              <td className="text-center px-4 py-3 border border-border/60 text-red-700">Expensive</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        * For a 60 m² apartment, January, Varna. Electricity cost only.
      </p>

      <h2>Which AC to Choose for Heating</h2>
      <p>Not every air conditioner heats well. Here is what to look for:</p>
      <ul>
        <li>
          <strong>SCOP ≥ 4.0</strong> — the minimum for efficient heating. This means
          energy class A++ or higher. Models with SCOP 4.5+ deliver noticeable savings.
        </li>
        <li>
          <strong>Operation down to -15°C</strong> — Varna occasionally sees -7°C. You
          want headroom. All serious inverter models from Daikin, Mitsubishi, and Gree
          work down to -15°C or even -25°C.
        </li>
        <li>
          <strong>Correct BTU sizing</strong> — bigger is not better. An oversized AC
          short-cycles (turns on and off), loses efficiency, and costs more to run.
        </li>
      </ul>

      <h3>Recommended BTU by Room Size</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Area</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">BTU (cooling)</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">BTU (heating)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">15-20 m²</td>
              <td className="text-center px-4 py-3 border border-border/60">7000-9000</td>
              <td className="text-center px-4 py-3 border border-border/60">9000-12000</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">20-30 m²</td>
              <td className="text-center px-4 py-3 border border-border/60">9000-12000</td>
              <td className="text-center px-4 py-3 border border-border/60">12000-14000</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">30-40 m²</td>
              <td className="text-center px-4 py-3 border border-border/60">12000-14000</td>
              <td className="text-center px-4 py-3 border border-border/60">14000-18000</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">40-60 m²</td>
              <td className="text-center px-4 py-3 border border-border/60">18000-24000</td>
              <td className="text-center px-4 py-3 border border-border/60">24000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        For heating, add 20-30% more BTU compared to cooling needs. If the room is
        25 m² on the top floor — go with 14000, not 12000 BTU.
      </p>

      <h2>Varna-Specific Tips</h2>

      <h3>Coastal Humidity and Corrosion</h3>
      <p>
        Varna is a seaside city. Salt air accelerates corrosion of the outdoor unit.
        Look for models with <strong>anti-corrosion coating</strong> on the condenser
        (Golden Fin or Blue Fin technology). Daikin and Mitsubishi include this as
        standard. Budget models without protection start rusting within 2-3 years.
      </p>

      <h3>Panel Buildings and Insulation</h3>
      <p>
        Most housing in Varna consists of Soviet-era panel buildings. Without external
        insulation, heat loss is 30-40% higher than in an insulated building. If your
        building has not been renovated, size up by 30% on BTU and consider sealing
        your window frames.
      </p>

      <h3>Night Tariff Strategy</h3>
      <p>
        Heat actively from 23:00 to 07:00 using the night tariff (0.069 BGN/kWh).
        Set 22-23°C overnight. In the morning, reduce to 19-20°C — the heat stored
        in walls and furniture will keep the apartment comfortable until noon. On
        sunny afternoons, you may not need to run the AC at all.
      </p>
      <p>
        The math: 0.248 (day) vs 0.069 (night) — <strong>3.6x cheaper</strong>.
        Just by shifting the main heating to nighttime hours, you save 30-40% on
        your monthly bill.
      </p>

      <h2>Mistakes That Cost You Money</h2>

      <h3>Mistake 1: Setting the Temperature to 24-25°C</h3>
      <p>
        Every degree above 21°C increases consumption by 6-8%. At 24°C you pay ~20%
        more than at 21°C. Wear a sweater and save 30-40 BGN per month.
      </p>

      <h3>Mistake 2: Open Windows While Heating</h3>
      <p>
        &quot;Just getting some fresh air&quot; — and all the heat goes outside. Ventilate
        for 5 minutes with the AC off, then close up and restart. A constantly
        cracked window can double your bill.
      </p>

      <h3>Mistake 3: Skipping Annual Maintenance</h3>
      <p>
        Dirty filters, clogged condenser, low refrigerant — all reduce efficiency
        by 15-25%. Annual maintenance costs 60-80 BGN and pays for itself in one
        month. An AC that has not been cleaned for 3 years performs like a
        lower-class appliance.
      </p>

      <h3>Mistake 4: Turning It On and Off Instead of Running Continuously</h3>
      <p>
        Inverter ACs are designed to run continuously at low speed. Frequent on-off
        cycling actually uses more electricity than maintaining a steady 21°C.
        Set your temperature and leave it.
      </p>

      <h2>Ready to Choose?</h2>
      <p>
        Our catalog features inverter models from Daikin, Mitsubishi, and Gree —
        all suitable for heating in Varna, with high SCOP ratings and anti-corrosion
        protection.
      </p>
      <p>
        Not sure which model fits your situation? Our AI consultant will ask a few
        questions about your room, budget, and needs — then recommend specific
        models with prices.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  UA content                                                         */
/* ------------------------------------------------------------------ */
function ContentUA() {
  return (
    <>
      <h2>Чому Варна ідеальна для опалення кондиціонером</h2>
      <p>
        Варна — це м&#39;яка зима. Середня температура в січні рідко опускається нижче
        +2...+3°C, а днів з морозами нижче -5°C за всю зиму набирається три-чотири.
        Для тих, хто переїхав з України, це звучить майже нереально — але саме це
        робить кондиціонер найвигіднішим способом опалення.
      </p>
      <p>
        Центрального опалення у Варні немає. Газ підведено далеко не скрізь. Більшість
        квартир опалюється електрикою. І тут інверторний кондиціонер стає не просто
        зручним варіантом, а найекономнішим способом не мерзнути взимку.
      </p>
      <p>
        Якщо порівняти: коли в Києві -15°C, у Варні +3°C. Морський клімат дає стабільність —
        жодних різких перепадів, жодних тижнів арктичного холоду. Саме це дозволяє
        кондиціонеру працювати з максимальною ефективністю.
      </p>

      <h2>Як працює опалення кондиціонером (простими словами)</h2>
      <p>
        Звичайний обігрівач перетворює електрику на тепло напряму: 1 кВт струму =
        1 кВт тепла. Кондиціонер працює інакше — він <strong>переносить</strong> тепло
        із зовнішнього повітря всередину. Навіть при 0°C надворі у повітрі достатньо
        теплової енергії, щоб її можна було &quot;викачати&quot;.
      </p>
      <p>
        Ключовий показник — <strong>COP</strong> (коефіцієнт продуктивності). Хороший
        інверторний кондиціонер при +7°C на вулиці має COP 3.5-4.5. Це означає: за
        кожний 1 кВт електрики ви отримуєте 3.5-4.5 кВт тепла. У три-чотири рази
        ефективніше за будь-який обігрівач.
      </p>
      <p>
        При 0°C COP знижується до 2.5-3.0. При -5°C — до 2.0-2.5. Але навіть при
        -5°C кондиціонер удвічі ефективніший за масляний радіатор. А скільки днів на
        рік у Варні буває -5°C? Лічені.
      </p>
      <p>
        Сезонний показник <strong>SCOP</strong> враховує середню ефективність за весь
        опалювальний сезон. Для Варни реальний SCOP добрих моделей сягає 4.5-5.0.
        Daikin Perfera, Mitsubishi MSZ-AP — усі в цьому діапазоні.
      </p>

      <h2>Реальні витрати на електрику: рахуємо в левах</h2>
      <p>Актуальні тарифи для побутових споживачів у Болгарії:</p>
      <ul>
        <li><strong>Денний тариф:</strong> 0.248 лв/кВтг (з ПДВ)</li>
        <li><strong>Нічний тариф:</strong> 0.069 лв/кВтг (з ПДВ, з 23:00 до 07:00)</li>
      </ul>
      <p>
        Нічний тариф — майже в 4 рази дешевший. Двотарифний лічильник є в більшості
        квартир. Якщо немає — встановити коштує ~50 лв, окупається за перший же місяць зими.
      </p>
      <p>
        Для орієнтиру: 1 лв (болгарський лев) ≈ 14.5 грн. Тобто нічний тариф —
        це приблизно 1 грн/кВтг. Удвічі дешевше за український нічний тариф.
      </p>

      <h3>Приклад: квартира 60 м², інверторний 12000 BTU</h3>
      <p>Вхідні дані:</p>
      <ul>
        <li>Панельний будинок, середня теплоізоляція</li>
        <li>Бажана температура: 21°C</li>
        <li>Середня температура надворі: +3°C (січень, Варна)</li>
        <li>Середній COP за сезон: 3.5</li>
        <li>Середня необхідна теплова потужність: 2.0-2.5 кВт</li>
      </ul>
      <p>
        При COP 3.5, для видачі 2.0 кВт тепла кондиціонер споживає ~0.57 кВт
        електрики. За 24 години: 0.57 x 24 = 13.7 кВтг на день.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Сценарій</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">кВтг/день</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Ціна/день</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Ціна/місяць</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">Тільки денний тариф</td>
              <td className="text-right px-4 py-3 border border-border/60">13.7</td>
              <td className="text-right px-4 py-3 border border-border/60">3.40 лв</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">~102 лв</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Нічний (8 год) + денний (16 год)</td>
              <td className="text-right px-4 py-3 border border-border/60">13.7</td>
              <td className="text-right px-4 py-3 border border-border/60">2.58 лв</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">~77 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Активний нічний + помірний денний</td>
              <td className="text-right px-4 py-3 border border-border/60">11.0</td>
              <td className="text-right px-4 py-3 border border-border/60">1.85 лв</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">~56 лв</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Реалістичний діапазон для січня: <strong>80-180 лв</strong> залежно від
        ізоляції, поверху і звичок. Це приблизно 1200-2600 грн. У листопаді та
        березні — 40-80 лв (580-1160 грн).
      </p>
      <p>
        За весь опалювальний сезон (листопад-березень): <strong>300-700 лв</strong>
        (4300-10000 грн). Для порівняння: електричний обігрівач за той самий
        період — 1500-2500 лв (21000-36000 грн).
      </p>

      <h2>Кондиціонер проти альтернатив: порівняльна таблиця</h2>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Пристрій</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">На місяць*</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Інвестиція</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Охолодження</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Вердикт</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-medium">Інверторний кондиціонер</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-green-700">80-180 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">1800-3500 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">Так</td>
              <td className="text-center px-4 py-3 border border-border/60 font-bold text-green-700">Найкращий</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-medium">Масляний радіатор</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-red-700">250-500 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">50-200 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">Ні</td>
              <td className="text-center px-4 py-3 border border-border/60 text-red-700">Дорого</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-medium">Інфрачервона панель</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-amber-700">200-380 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">400-1200 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">Ні</td>
              <td className="text-center px-4 py-3 border border-border/60 text-amber-700">Середньо</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-medium">Тепла підлога (ел.)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold text-red-700">300-550 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">2000-5000 лв</td>
              <td className="text-center px-4 py-3 border border-border/60">Ні</td>
              <td className="text-center px-4 py-3 border border-border/60 text-red-700">Дорого</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        * Для квартири 60 м², січень, Варна. Лише вартість електрики.
      </p>

      <h2>Який кондиціонер обрати для опалення</h2>
      <p>Не кожен кондиціонер добре гріє. Ось на що дивитися:</p>
      <ul>
        <li>
          <strong>SCOP ≥ 4.0</strong> — мінімум для ефективного опалення. Це клас
          A++ і вище. Моделі з SCOP 4.5+ дають відчутну економію.
        </li>
        <li>
          <strong>Робота при -15°C і нижче</strong> — навіть у Варні буває -7°C.
          Потрібен запас. Daikin, Mitsubishi, Gree — усі серйозні інверторні моделі
          працюють до -15°C або -25°C.
        </li>
        <li>
          <strong>Правильний BTU</strong> — більше не означає краще. Завеликий
          кондиціонер тактує (вмикається-вимикається), втрачає ефективність і
          споживає більше.
        </li>
      </ul>

      <h3>Рекомендовані BTU за площею</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Площа</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">BTU (охолодження)</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">BTU (опалення)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">15-20 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">7000-9000</td>
              <td className="text-center px-4 py-3 border border-border/60">9000-12000</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">20-30 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">9000-12000</td>
              <td className="text-center px-4 py-3 border border-border/60">12000-14000</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">30-40 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">12000-14000</td>
              <td className="text-center px-4 py-3 border border-border/60">14000-18000</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">40-60 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">18000-24000</td>
              <td className="text-center px-4 py-3 border border-border/60">24000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Для опалення потрібно на 20-30% більше BTU порівняно з охолодженням. Якщо
        кімната 25 м² на останньому поверсі — беріть 14000, а не 12000 BTU.
      </p>

      <h2>Поради спеціально для Варни</h2>

      <h3>Морська вологість та корозія</h3>
      <p>
        Варна — приморське місто. Солоне повітря прискорює корозію зовнішнього блоку.
        Шукайте моделі з <strong>антикорозійним покриттям</strong> конденсатора (Golden
        Fin або Blue Fin). Daikin та Mitsubishi включають це в стандартну комплектацію.
        Дешеві моделі без захисту починають іржавіти через 2-3 роки.
      </p>

      <h3>Панельні будинки та теплоізоляція</h3>
      <p>
        Більшість житла у Варні — панельні будинки, схожі на наші. Без зовнішнього
        утеплення тепловтрати на 30-40% вищі. Якщо будинок не утеплений, закладайте
        +30% по BTU і подумайте про ущільнення вікон.
      </p>

      <h3>Стратегія з нічним тарифом</h3>
      <p>
        Активно грійте з 23:00 до 07:00 за нічним тарифом (0.069 лв/кВтг, ~1 грн).
        Ставте 22-23°C на ніч. Вранці знижуйте до 19-20°C — тепло, накопичене в
        стінах та меблях, тримає комфортну температуру до обіду. Вдень, якщо сонячно,
        можна взагалі не вмикати.
      </p>
      <p>
        Різниця: 0.248 (день) проти 0.069 (ніч) — <strong>у 3.6 рази дешевше</strong>.
        Лише за рахунок перенесення основного опалення на ніч ви економите 30-40%
        місячного рахунку.
      </p>

      <h2>Помилки, які коштують грошей</h2>

      <h3>Помилка 1: Температура 24-25°C</h3>
      <p>
        Кожен градус вище 21°C збільшує споживання на 6-8%. При 24°C ви платите
        ~20% більше, ніж при 21°C. Одягніть светр — зекономите 30-40 лв на місяць.
      </p>

      <h3>Помилка 2: Відчинені вікна при працюючому кондиціонері</h3>
      <p>
        &quot;Впустити свіже повітря&quot; — і тепло йде надвір. Провітрюйте 5 хвилин з
        вимкненим кондиціонером, потім зачиняйте і вмикайте. Постійно прочинене
        вікно може подвоїти рахунок.
      </p>

      <h3>Помилка 3: Пропуск щорічного обслуговування</h3>
      <p>
        Брудні фільтри, забитий конденсатор, недостача фреону — все це знижує
        ефективність на 15-25%. Щорічне ТО коштує 60-80 лв (870-1160 грн) і
        окупається за перший же місяць зими.
      </p>

      <h3>Помилка 4: Увімкнення-вимкнення замість постійної роботи</h3>
      <p>
        Інверторний кондиціонер спроектований для постійної роботи на низьких
        обертах. Часте увімкнення-вимкнення насправді споживає більше електрики,
        ніж постійна робота при 21°C. Виставте температуру і залиште його працювати.
      </p>

      <h2>Готові обрати?</h2>
      <p>
        У нашому каталозі — інверторні моделі Daikin, Mitsubishi та Gree, підходящі
        для опалення у Варні. Всі з високим SCOP та антикорозійним захистом.
      </p>
      <p>
        Не впевнені, яка модель вам підходить? Наш AI консультант поставить кілька
        запитань про кімнату, бюджет і потреби — і запропонує конкретні моделі з цінами.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Post definition                                                    */
/* ------------------------------------------------------------------ */
export const heatingWithAc: BlogPost = {
  slug: "heating-with-ac",
  date: "2026-04-20",
  image: "/images/blog/heating-with-ac.jpg",
  readingTime: {
    bg: "12 мин",
    en: "12 min",
    ru: "12 мин",
    ua: "12 хв",
  },
  title: {
    bg: "Отопление с климатик във Варна: реални сметки и практични съвети",
    en: "Heating with an AC in Varna: Real Costs and Practical Tips",
    ru: "Отопление кондиционером в Варне: реальные расходы и практические советы",
    ua: "Опалення кондиціонером у Варні: реальні витрати та практичні поради",
  },
  excerpt: {
    bg: "Колко струва отоплението с инверторен климатик във Варна? Сравняваме сметки, обясняваме COP и SCOP, и даваме конкретни съвети за панелни блокове и нощна тарифа.",
    en: "How much does it cost to heat with an inverter AC in Varna? We compare bills, explain COP and SCOP in simple terms, and share practical tips for panel buildings and night tariff savings.",
    ru: "Сколько стоит отопление инверторным кондиционером в Варне? Сравниваем счета, объясняем COP и SCOP простыми словами, даем конкретные советы для панельных домов и ночного тарифа.",
    ua: "Скільки коштує опалення інверторним кондиціонером у Варні? Порівнюємо рахунки, пояснюємо COP та SCOP простими словами, даємо конкретні поради для панельних будинків та нічного тарифу.",
  },
  keywords: {
    bg: ["отопление климатик Варна", "инверторен климатик отопление", "сметки ток Варна", "COP климатик", "нощна тарифа отопление"],
    en: ["AC heating Varna", "inverter AC heating costs", "electricity bills Varna", "COP air conditioner", "night tariff Bulgaria"],
    ru: ["отопление кондиционером Варна", "инверторный кондиционер отопление", "счета за электричество Варна", "COP кондиционер", "ночной тариф Болгария"],
    ua: ["опалення кондиціонером Варна", "інверторний кондиціонер опалення", "рахунки за електрику Варна", "COP кондиціонер", "нічний тариф Болгарія"],
  },
  content: {
    bg: ContentBG,
    en: ContentEN,
    ru: ContentRU,
    ua: ContentUA,
  },
};
