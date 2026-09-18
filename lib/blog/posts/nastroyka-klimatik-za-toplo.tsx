import type { BlogPost } from "../types";

/* ------------------------------------------------------------------ */
/*  BG                                                                 */
/* ------------------------------------------------------------------ */
function ContentBG() {
  return (
    <>
      <p>
        Всяка есен получаваме едни и същи обаждания: „Пуснах климатика на топло, а
        духа студено“, „Настроих 30 градуса, а стаята не се стопля“, „Външното тяло
        пуши — счупи ли се?“. В 9 от 10 случая уредът е изправен — просто е настроен
        грешно. Ето как се прави правилно, стъпка по стъпка, и какво означават
        нещата, които плашат хората.
      </p>

      <h2>1. Режим Heat — и как да го познаете на всяко дистанционно</h2>
      <p>
        Бутонът <strong>MODE</strong> превърта режимите: Auto → Cool → Dry → Fan →
        Heat. Търсите иконата <strong>слънце</strong> (при Gree, AUX, Nippon, Toshiba)
        или надписа <strong>HEAT</strong> (Daikin, Mitsubishi). Ако на дисплея има
        снежинка — сте на Cool и уредът ще охлажда, колкото и градуса да зададете.
      </p>
      <p>
        Режим <strong>Auto</strong> не е „умен“ — той превключва между топло и студено
        около зададената температура и през преходните месеци може да охлажда в 7
        сутринта. За зимата задайте изрично Heat.
      </p>

      <h2>2. Каква температура да зададете</h2>
      <p>
        <strong>21–23 °C.</strong> Не 28, не 30. Инверторният климатик не работи
        „по-силно“ при по-висока настройка — той работи по-дълго на пълна мощност, за да
        стигне дотам, а всеки градус над 22 °C е около 5–7 % повече ток. Ако ви е
        студено при 22 °C, проблемът е в посоката на въздуха или в мощността на уреда,
        не в цифрата.
      </p>
      <p>
        Първите 5–10 минути след пускане на Heat уредът <strong>нарочно не духа</strong>
        — изчаква топлообменникът да се загрее, за да не ви обдухва със студен въздух.
        На дисплея на Gree и AUX в този момент свети индикатор за „предварително
        загряване“. Това не е дефект.
      </p>

      <h2>3. Посока на въздуха: надолу, не напред</h2>
      <p>
        Топлият въздух се качва. Ако жалузите са хоризонтални (както през лятото), топлината
        остава под тавана, а на нивото на краката е 17 °C. Настройте вертикалните жалузи
        <strong>максимално надолу</strong> — бутонът <strong>SWING</strong> и после спиране в
        най-ниска позиция, или директно „надолу“ при Daikin/Mitsubishi. Разликата в усещането е
        като два-три градуса.
      </p>

      <h2>4. Скорост на вентилатора</h2>
      <p>
        През зимата оставете <strong>Auto</strong>. Уредът сам подава повече въздух,
        докато стаята е студена, и намалява, когато достигне температурата. Ръчна ниска
        скорост (Low / Quiet) в студена стая е грешка — топлообменникът прегрява, компресорът
        спира по защита и стаята не се стопля.
      </p>

      <h2>5. Външното тяло „пуши“ и капе — това е нормално</h2>
      <p>
        При отопление външното тяло се охлажда под нулата и по него се образува скреж. На
        всеки 40–60 минути уредът за 3–5 минути спира да топли, вътрешният вентилатор
        замлъква и външното тяло изпуска пара — това е <strong>цикъл на размразяване
        (defrost)</strong>. Водата под външното тяло през зимата е точно от него. Не е
        повреда, не пипайте нищо.
      </p>
      <p>
        Ако външното тяло стои над тротоар или балкон на съсед, поставете дренажна тапа
        и маркуч за конденза, за да не се образува лед. Правим го при монтаж, ако ни кажете
        предварително.
      </p>

      <h2>6. Ако „климатикът не топли“ — 5 проверки преди да звъните на сервиз</h2>
      <ol>
        <li><strong>Режимът е Heat (слънце), не Cool или Dry.</strong> Най-честата причина.</li>
        <li><strong>Температурата е над стайната.</strong> Ако е 22 °C в стаята и сте задали 22 — уредът просто чака.</li>
        <li><strong>Не е в defrost.</strong> Изчакайте 10 минути.</li>
        <li><strong>Филтрите са чисти.</strong> Запушен филтър = слаб въздушен поток = стаята не се топли. Измийте ги с вода.</li>
        <li><strong>Външното тяло не е затрупано.</strong> Сняг, листа или кутии пред него блокират обмена.</li>
      </ol>
      <p>
        Ако след това пак духа хладко при -5 °C навън — уредът може да е достигнал границата
        си. Базовите модели са оразмерени за работа до -7…-10 °C; за основно отопление във
        Варна изберете модел с работа до -15 °C и SCOP над 4.
      </p>

      <h2>7. Настройки за пестене на ток през зимата</h2>
      <ul>
        <li><strong>Не изключвайте уреда, когато излизате за 2–3 часа.</strong> Свалете на 18–19 °C. Повторното загряване на изстинала стая струва повече от поддържането.</li>
        <li><strong>Нощем — 19–20 °C и Sleep режим</strong>, който леко намалява температурата и шума през нощта.</li>
        <li><strong>Таймер</strong>: включване 30 минути преди ставане, вместо пълна мощност в 6 сутринта, когато навън е най-студено.</li>
        <li><strong>Затворете вратите</strong> на стаята, в която работи уредът. Един климатик 12 000 BTU топли една стая, не апартамент.</li>
      </ul>

      <h2>Особености при най-разпространените марки</h2>
      <p>
        <strong>Gree</strong>: иконата за Heat е слънце; функцията <strong>I FEEL</strong> мери
        температурата при дистанционното, а не при уреда — ползвайте я, ако седите далеч от
        климатика. <strong>Daikin</strong>: бутон <strong>POWERFUL</strong> дава 20 минути пълна
        мощност за бързо загряване. <strong>Mitsubishi Heavy</strong>: режимът <strong>HI POWER</strong>
        е същото; <strong>ECONO</strong> ограничава мощността за пестене. <strong>Toshiba</strong>:
        функция <strong>Hi POWER</strong> и <strong>Comfort Sleep</strong>. <strong>AUX</strong>:
        <strong>Turbo</strong> и <strong>8 °C Heating</strong> — поддържа стаята на 8 °C, за да не
        замръзне, когато ви няма дни наред.
      </p>

      <h2>Кога наистина е нужен сервиз</h2>
      <p>
        Ако уредът показва код за грешка (E1, H6, F0 и т.н.), ако външното тяло не тръгва
        изобщо, или ако топлообменникът обледенява и не се размразява — обадете се. Диагностиката
        е 20 €, а при ремонт от нас не се заплаща. Годишната профилактика преди сезона
        предотвратява повечето от тези случаи.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  EN                                                                 */
/* ------------------------------------------------------------------ */
function ContentEN() {
  return (
    <>
      <p>
        Every autumn we get the same calls: “I switched the AC to heating and it blows cold”,
        “I set 30 degrees and the room won’t warm up”, “The outdoor unit is steaming — is it
        broken?”. Nine times out of ten the unit is fine — it is just set wrong. Here is how
        to do it properly, step by step, and what the scary-looking things actually mean.
      </p>

      <h2>1. Heat mode — and how to spot it on any remote</h2>
      <p>
        The <strong>MODE</strong> button cycles Auto → Cool → Dry → Fan → Heat. Look for the
        <strong> sun</strong> icon (Gree, AUX, Nippon, Toshiba) or the word <strong>HEAT</strong>
        (Daikin, Mitsubishi). If the display shows a snowflake you are in Cool and the unit
        will cool no matter what temperature you set.
      </p>
      <p>
        <strong>Auto</strong> is not “smart” — it switches between heating and cooling around
        the set point and in the shoulder months can cool at 7 a.m. For winter, select Heat
        explicitly.
      </p>

      <h2>2. What temperature to set</h2>
      <p>
        <strong>21–23 °C.</strong> Not 28, not 30. An inverter does not work “harder” at a
        higher setting — it runs longer at full output to get there, and every degree above
        22 °C costs about 5–7 % more electricity. If you feel cold at 22 °C the problem is
        airflow direction or unit capacity, not the number.
      </p>
      <p>
        For the first 5–10 minutes after switching to Heat the unit <strong>deliberately does
        not blow</strong> — it waits for the heat exchanger to warm up so it does not blast you
        with cold air. Gree and AUX show a “pre-heating” indicator during this time. Not a fault.
      </p>

      <h2>3. Airflow direction: down, not forward</h2>
      <p>
        Warm air rises. With the louvres horizontal (the summer position) the heat stays under
        the ceiling while it is 17 °C at floor level. Point the vertical louvres <strong>fully
        down</strong> — press <strong>SWING</strong> and stop at the lowest position, or select
        “down” directly on Daikin/Mitsubishi. It feels like a two- or three-degree difference.
      </p>

      <h2>4. Fan speed</h2>
      <p>
        In winter leave it on <strong>Auto</strong>. The unit pushes more air while the room is
        cold and slows down once it reaches temperature. Forcing Low / Quiet in a cold room is a
        mistake — the heat exchanger overheats, the compressor stops on protection and the room
        never warms up.
      </p>

      <h2>5. The outdoor unit “steams” and drips — that is normal</h2>
      <p>
        When heating, the outdoor unit runs below freezing and frost builds on it. Every 40–60
        minutes the unit stops heating for 3–5 minutes, the indoor fan goes quiet and the
        outdoor unit releases steam — that is the <strong>defrost cycle</strong>. The water under
        the outdoor unit in winter comes from exactly this. Not a fault, do not touch anything.
      </p>
      <p>
        If the outdoor unit sits above a pavement or a neighbour’s balcony, fit a drain plug and
        hose for the condensate so ice does not form. We do it at installation if you tell us in
        advance.
      </p>

      <h2>6. “The AC won’t heat” — 5 checks before calling service</h2>
      <ol>
        <li><strong>Mode is Heat (sun), not Cool or Dry.</strong> The most common cause.</li>
        <li><strong>Set temperature is above room temperature.</strong> If the room is 22 °C and you set 22, the unit simply waits.</li>
        <li><strong>It is not in defrost.</strong> Wait 10 minutes.</li>
        <li><strong>Filters are clean.</strong> Clogged filter = weak airflow = room does not warm. Rinse with water.</li>
        <li><strong>The outdoor unit is not blocked.</strong> Snow, leaves or boxes in front of it stop the heat exchange.</li>
      </ol>
      <p>
        If it still blows lukewarm at -5 °C outside, the unit may have reached its limit. Entry
        models are rated to -7…-10 °C; for primary heating in Varna pick a model rated to -15 °C
        with SCOP above 4.
      </p>

      <h2>7. Settings that save electricity in winter</h2>
      <ul>
        <li><strong>Do not switch off when leaving for 2–3 hours.</strong> Drop to 18–19 °C. Reheating a cold room costs more than holding it.</li>
        <li><strong>At night — 19–20 °C and Sleep mode</strong>, which gently lowers temperature and noise overnight.</li>
        <li><strong>Timer</strong>: start 30 minutes before you get up instead of full power at 6 a.m. when it is coldest outside.</li>
        <li><strong>Close the doors</strong> of the room the unit is in. One 12,000 BTU unit heats one room, not an apartment.</li>
      </ul>

      <h2>Brand specifics</h2>
      <p>
        <strong>Gree</strong>: the Heat icon is a sun; <strong>I FEEL</strong> measures temperature
        at the remote, not the unit — use it if you sit far from the AC. <strong>Daikin</strong>:
        <strong> POWERFUL</strong> gives 20 minutes of full output for fast warm-up.
        <strong> Mitsubishi Heavy</strong>: <strong>HI POWER</strong> does the same; <strong>ECONO</strong>
        caps output to save. <strong>Toshiba</strong>: <strong>Hi POWER</strong> and
        <strong> Comfort Sleep</strong>. <strong>AUX</strong>: <strong>Turbo</strong> and
        <strong> 8 °C Heating</strong> — holds the room at 8 °C so it does not freeze while you are away for days.
      </p>

      <h2>When you really need service</h2>
      <p>
        If the unit shows an error code (E1, H6, F0 etc.), if the outdoor unit does not start at
        all, or if the heat exchanger ices up and does not defrost — call us. Diagnostics is €20
        and is waived if we do the repair. Annual maintenance before the season prevents most of
        these cases.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  RU                                                                 */
/* ------------------------------------------------------------------ */
function ContentRU() {
  return (
    <>
      <p>
        Каждую осень мы получаем одни и те же звонки: «Включил кондиционер на тепло, а дует
        холодом», «Поставил 30 градусов, а комната не греется», «Наружный блок дымит —
        сломался?». В 9 случаях из 10 аппарат исправен — просто настроен неправильно. Вот как
        сделать правильно, по шагам, и что значат вещи, которые пугают людей.
      </p>

      <h2>1. Режим Heat — и как его узнать на любом пульте</h2>
      <p>
        Кнопка <strong>MODE</strong> перебирает режимы: Auto → Cool → Dry → Fan → Heat. Ищите
        значок <strong>солнце</strong> (Gree, AUX, Nippon, Toshiba) или надпись <strong>HEAT</strong>
        (Daikin, Mitsubishi). Если на дисплее снежинка — вы в Cool, и аппарат будет охлаждать,
        сколько бы градусов вы ни задали.
      </p>
      <p>
        Режим <strong>Auto</strong> не «умный» — он переключается между теплом и холодом вокруг
        заданной температуры и в переходные месяцы может охлаждать в 7 утра. На зиму задайте
        явно Heat.
      </p>

      <h2>2. Какую температуру задать</h2>
      <p>
        <strong>21–23 °C.</strong> Не 28, не 30. Инвертор не работает «сильнее» при более высокой
        настройке — он дольше работает на полной мощности, чтобы туда добраться, а каждый градус
        выше 22 °C — это около 5–7 % больше электричества. Если вам холодно при 22 °C, проблема в
        направлении потока или мощности аппарата, а не в цифре.
      </p>
      <p>
        Первые 5–10 минут после включения Heat аппарат <strong>намеренно не дует</strong> — ждёт,
        пока прогреется теплообменник, чтобы не обдувать вас холодным воздухом. У Gree и AUX в
        этот момент горит индикатор «предварительный прогрев». Это не дефект.
      </p>

      <h2>3. Направление воздуха: вниз, а не вперёд</h2>
      <p>
        Тёплый воздух поднимается. Если жалюзи горизонтальны (как летом), тепло остаётся под
        потолком, а на уровне ног 17 °C. Направьте вертикальные жалюзи <strong>максимально
        вниз</strong> — кнопка <strong>SWING</strong>, затем остановка в нижнем положении, или сразу
        «вниз» у Daikin/Mitsubishi. По ощущениям это два-три градуса разницы.
      </p>

      <h2>4. Скорость вентилятора</h2>
      <p>
        Зимой оставьте <strong>Auto</strong>. Аппарат сам подаёт больше воздуха, пока комната
        холодная, и снижает обороты по достижении температуры. Ручная низкая скорость (Low /
        Quiet) в холодной комнате — ошибка: теплообменник перегревается, компрессор
        останавливается по защите, и комната не греется.
      </p>

      <h2>5. Наружный блок «дымит» и капает — это нормально</h2>
      <p>
        При обогреве наружный блок охлаждается ниже нуля, и на нём образуется иней. Каждые 40–60
        минут аппарат на 3–5 минут прекращает греть, внутренний вентилятор замолкает, а наружный
        блок выпускает пар — это <strong>цикл оттайки (defrost)</strong>. Вода под наружным блоком
        зимой — именно от него. Не поломка, ничего не трогайте.
      </p>
      <p>
        Если наружный блок висит над тротуаром или балконом соседа, поставьте дренажную заглушку
        и шланг для конденсата, чтобы не образовывался лёд. Делаем это при монтаже, если скажете
        заранее.
      </p>

      <h2>6. Если «кондиционер не греет» — 5 проверок до звонка в сервис</h2>
      <ol>
        <li><strong>Режим — Heat (солнце), а не Cool или Dry.</strong> Самая частая причина.</li>
        <li><strong>Заданная температура выше комнатной.</strong> Если в комнате 22 °C и задано 22 — аппарат просто ждёт.</li>
        <li><strong>Не идёт оттайка.</strong> Подождите 10 минут.</li>
        <li><strong>Фильтры чистые.</strong> Забитый фильтр = слабый поток = комната не греется. Промойте водой.</li>
        <li><strong>Наружный блок не завален.</strong> Снег, листья или коробки перед ним блокируют теплообмен.</li>
      </ol>
      <p>
        Если после этого всё равно дует чуть тёплым при -5 °C на улице — аппарат мог достичь
        своего предела. Базовые модели рассчитаны на работу до -7…-10 °C; для основного отопления
        в Варне выбирайте модель с работой до -15 °C и SCOP выше 4.
      </p>

      <h2>7. Настройки для экономии электричества зимой</h2>
      <ul>
        <li><strong>Не выключайте аппарат, уходя на 2–3 часа.</strong> Снизьте до 18–19 °C. Повторный прогрев остывшей комнаты стоит дороже поддержания.</li>
        <li><strong>Ночью — 19–20 °C и режим Sleep</strong>, который плавно снижает температуру и шум.</li>
        <li><strong>Таймер</strong>: включение за 30 минут до подъёма вместо полной мощности в 6 утра, когда на улице холоднее всего.</li>
        <li><strong>Закройте двери</strong> комнаты, где работает аппарат. Один кондиционер 12 000 BTU греет одну комнату, а не квартиру.</li>
      </ul>

      <h2>Особенности популярных марок</h2>
      <p>
        <strong>Gree</strong>: значок Heat — солнце; функция <strong>I FEEL</strong> измеряет
        температуру у пульта, а не у аппарата — используйте, если сидите далеко от кондиционера.
        <strong> Daikin</strong>: кнопка <strong>POWERFUL</strong> даёт 20 минут полной мощности для
        быстрого прогрева. <strong>Mitsubishi Heavy</strong>: <strong>HI POWER</strong> — то же самое;
        <strong> ECONO</strong> ограничивает мощность для экономии. <strong>Toshiba</strong>:
        <strong> Hi POWER</strong> и <strong>Comfort Sleep</strong>. <strong>AUX</strong>:
        <strong> Turbo</strong> и <strong>8 °C Heating</strong> — держит комнату на 8 °C, чтобы не
        промёрзла, пока вас нет несколько дней.
      </p>

      <h2>Когда действительно нужен сервис</h2>
      <p>
        Если аппарат показывает код ошибки (E1, H6, F0 и т. д.), если наружный блок вообще не
        запускается или если теплообменник обледеневает и не оттаивает — звоните. Диагностика
        стоит 20 € и не взимается при ремонте у нас. Ежегодная профилактика перед сезоном
        предотвращает большинство таких случаев.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  UA                                                                 */
/* ------------------------------------------------------------------ */
function ContentUA() {
  return (
    <>
      <p>
        Щоосені ми отримуємо ті самі дзвінки: «Увімкнув кондиціонер на тепло, а дме холодом»,
        «Поставив 30 градусів, а кімната не гріється», «Зовнішній блок димить — зламався?». У 9
        випадках із 10 апарат справний — просто налаштований неправильно. Ось як зробити
        правильно, покроково, і що означають речі, які лякають людей.
      </p>

      <h2>1. Режим Heat — і як його впізнати на будь-якому пульті</h2>
      <p>
        Кнопка <strong>MODE</strong> перебирає режими: Auto → Cool → Dry → Fan → Heat. Шукайте
        значок <strong>сонце</strong> (Gree, AUX, Nippon, Toshiba) або напис <strong>HEAT</strong>
        (Daikin, Mitsubishi). Якщо на дисплеї сніжинка — ви в Cool, і апарат охолоджуватиме,
        скільки б градусів ви не задали.
      </p>
      <p>
        Режим <strong>Auto</strong> не «розумний» — він перемикається між теплом і холодом навколо
        заданої температури й у перехідні місяці може охолоджувати о 7 ранку. На зиму задайте
        явно Heat.
      </p>

      <h2>2. Яку температуру задати</h2>
      <p>
        <strong>21–23 °C.</strong> Не 28, не 30. Інвертор не працює «сильніше» за вищої настройки
        — він довше працює на повній потужності, щоб туди дістатися, а кожен градус вище 22 °C —
        це близько 5–7 % більше електрики. Якщо вам холодно при 22 °C, проблема в напрямку потоку
        або потужності апарата, а не в цифрі.
      </p>
      <p>
        Перші 5–10 хвилин після ввімкнення Heat апарат <strong>навмисно не дме</strong> — чекає,
        поки прогріється теплообмінник, щоб не обдувати вас холодним повітрям. У Gree і AUX у цей
        момент світиться індикатор «попередній прогрів». Це не дефект.
      </p>

      <h2>3. Напрямок повітря: вниз, а не вперед</h2>
      <p>
        Тепле повітря піднімається. Якщо жалюзі горизонтальні (як улітку), тепло залишається під
        стелею, а на рівні ніг 17 °C. Спрямуйте вертикальні жалюзі <strong>максимально вниз</strong>
        — кнопка <strong>SWING</strong>, потім зупинка в нижньому положенні, або одразу «вниз» у
        Daikin/Mitsubishi. За відчуттями це два-три градуси різниці.
      </p>

      <h2>4. Швидкість вентилятора</h2>
      <p>
        Узимку залиште <strong>Auto</strong>. Апарат сам подає більше повітря, поки кімната
        холодна, і знижує оберти після досягнення температури. Ручна низька швидкість (Low /
        Quiet) у холодній кімнаті — помилка: теплообмінник перегрівається, компресор зупиняється
        за захистом, і кімната не гріється.
      </p>

      <h2>5. Зовнішній блок «димить» і капає — це нормально</h2>
      <p>
        Під час обігріву зовнішній блок охолоджується нижче нуля, і на ньому утворюється іній.
        Кожні 40–60 хвилин апарат на 3–5 хвилин припиняє гріти, внутрішній вентилятор замовкає, а
        зовнішній блок випускає пару — це <strong>цикл відтавання (defrost)</strong>. Вода під
        зовнішнім блоком узимку — саме від нього. Не поломка, нічого не чіпайте.
      </p>
      <p>
        Якщо зовнішній блок висить над тротуаром або балконом сусіда, поставте дренажну заглушку
        і шланг для конденсату, щоб не утворювався лід. Робимо це під час монтажу, якщо скажете
        заздалегідь.
      </p>

      <h2>6. Якщо «кондиціонер не гріє» — 5 перевірок до дзвінка в сервіс</h2>
      <ol>
        <li><strong>Режим — Heat (сонце), а не Cool чи Dry.</strong> Найчастіша причина.</li>
        <li><strong>Задана температура вища за кімнатну.</strong> Якщо в кімнаті 22 °C і задано 22 — апарат просто чекає.</li>
        <li><strong>Не йде відтавання.</strong> Зачекайте 10 хвилин.</li>
        <li><strong>Фільтри чисті.</strong> Забитий фільтр = слабкий потік = кімната не гріється. Промийте водою.</li>
        <li><strong>Зовнішній блок не завалений.</strong> Сніг, листя чи коробки перед ним блокують теплообмін.</li>
      </ol>
      <p>
        Якщо після цього все одно дме ледь теплим при -5 °C на вулиці — апарат міг досягти своєї
        межі. Базові моделі розраховані на роботу до -7…-10 °C; для основного опалення у Варні
        обирайте модель із роботою до -15 °C і SCOP вище 4.
      </p>

      <h2>7. Налаштування для економії електрики взимку</h2>
      <ul>
        <li><strong>Не вимикайте апарат, ідучи на 2–3 години.</strong> Знизьте до 18–19 °C. Повторний прогрів охололої кімнати коштує дорожче за підтримання.</li>
        <li><strong>Уночі — 19–20 °C і режим Sleep</strong>, який плавно знижує температуру й шум.</li>
        <li><strong>Таймер</strong>: увімкнення за 30 хвилин до підйому замість повної потужності о 6 ранку, коли на вулиці найхолодніше.</li>
        <li><strong>Зачиніть двері</strong> кімнати, де працює апарат. Один кондиціонер 12 000 BTU гріє одну кімнату, а не квартиру.</li>
      </ul>

      <h2>Особливості популярних марок</h2>
      <p>
        <strong>Gree</strong>: значок Heat — сонце; функція <strong>I FEEL</strong> вимірює температуру
        біля пульта, а не біля апарата — використовуйте, якщо сидите далеко від кондиціонера.
        <strong> Daikin</strong>: кнопка <strong>POWERFUL</strong> дає 20 хвилин повної потужності для
        швидкого прогріву. <strong>Mitsubishi Heavy</strong>: <strong>HI POWER</strong> — те саме;
        <strong> ECONO</strong> обмежує потужність для економії. <strong>Toshiba</strong>:
        <strong> Hi POWER</strong> і <strong>Comfort Sleep</strong>. <strong>AUX</strong>:
        <strong> Turbo</strong> і <strong>8 °C Heating</strong> — тримає кімнату на 8 °C, щоб не
        промерзла, поки вас немає кілька днів.
      </p>

      <h2>Коли справді потрібен сервіс</h2>
      <p>
        Якщо апарат показує код помилки (E1, H6, F0 тощо), якщо зовнішній блок узагалі не
        запускається або якщо теплообмінник обмерзає й не відтає — телефонуйте. Діагностика коштує
        20 € і не стягується за ремонту в нас. Щорічна профілактика перед сезоном запобігає
        більшості таких випадків.
      </p>
    </>
  );
}

export const nastroykaKlimatikZaToplo: BlogPost = {
  slug: "nastroyka-klimatik-za-toplo",
  date: "2026-09-18",
  image: "/portfolio/15-gree-display-30c.jpg",
  readingTime: { bg: "7 мин", en: "7 min", ru: "7 мин", ua: "7 хв" },
  title: {
    bg: "Как да настроите климатика за отопление: режим, температура и защо „не топли“",
    en: "How to set your AC for heating: mode, temperature and why it \"won't heat\"",
    ru: "Как настроить кондиционер на тепло: режим, температура и почему «не греет»",
    ua: "Як налаштувати кондиціонер на тепло: режим, температура і чому «не гріє»",
  },
  excerpt: {
    bg: "Режим Heat, 21–23 °C, жалузи надолу, вентилатор на Auto — и какво означава парата от външното тяло. 5 проверки преди да звъните на сервиз и настройките, които пестят ток.",
    en: "Heat mode, 21–23 °C, louvres down, fan on Auto — and what the steam from the outdoor unit means. 5 checks before calling service and the settings that save electricity.",
    ru: "Режим Heat, 21–23 °C, жалюзи вниз, вентилятор на Auto — и что значит пар из наружного блока. 5 проверок до звонка в сервис и настройки, которые экономят электричество.",
    ua: "Режим Heat, 21–23 °C, жалюзі вниз, вентилятор на Auto — і що означає пара із зовнішнього блока. 5 перевірок до дзвінка в сервіс і налаштування, які економлять електрику.",
  },
  keywords: {
    bg: ["настройка на климатик за топло", "климатик на топло", "климатик не топли", "режим heat климатик", "настройка на климатик за топло gree", "външно тяло пуши"],
    en: ["AC heating settings", "air conditioner heat mode", "AC not heating", "how to set AC to heat", "outdoor unit steaming"],
    ru: ["настройка кондиционера на тепло", "кондиционер не греет", "режим heat кондиционер", "как включить кондиционер на обогрев", "наружный блок дымит"],
    ua: ["налаштування кондиціонера на тепло", "кондиціонер не гріє", "режим heat кондиціонер", "як увімкнути кондиціонер на обігрів", "зовнішній блок димить"],
  },
  content: { bg: ContentBG, en: ContentEN, ru: ContentRU, ua: ContentUA },
  faq: {
    bg: [
      { question: "Каква температура да настроя на климатика за отопление?", answer: "21–23 °C. По-високата настройка не топли по-бързо, а само увеличава сметката с 5–7 % на градус. Ако ви е студено при 22 °C, насочете жалузите надолу и проверете дали вентилаторът е на Auto." },
      { question: "Защо климатикът духа студено, когато е на топло?", answer: "Първите 5–10 минути уредът изчаква топлообменникът да се загрее и не духа нарочно. Ако след това пак духа студено, проверете дали режимът е Heat (слънце), а не Cool или Dry, и дали не е в цикъл на размразяване." },
      { question: "Външното тяло пуши и капе вода — повреда ли е?", answer: "Не. При отопление на всеки 40–60 минути уредът размразява външното тяло 3–5 минути — тогава от него излиза пара и капе вода. Това е нормален цикъл на defrost." },
      { question: "До каква външна температура топли климатикът?", answer: "Базовите модели — до -7…-10 °C, при които мощността вече пада. Моделите за основно отопление (Gree Amber/Soyal, Mitsubishi Heavy SRK, Daikin) работят до -15…-25 °C със запазена мощност." },
    ],
    en: [
      { question: "What temperature should I set the AC to for heating?", answer: "21–23 °C. A higher setting does not heat faster, it only adds 5–7 % to the bill per degree. If you feel cold at 22 °C, point the louvres down and check that the fan is on Auto." },
      { question: "Why does the AC blow cold when set to heat?", answer: "For the first 5–10 minutes the unit waits for the heat exchanger to warm up and deliberately does not blow. If it still blows cold afterwards, check that the mode is Heat (sun), not Cool or Dry, and that it is not in a defrost cycle." },
      { question: "The outdoor unit steams and drips water — is it broken?", answer: "No. When heating, every 40–60 minutes the unit defrosts the outdoor unit for 3–5 minutes — that is when steam and water appear. It is a normal defrost cycle." },
      { question: "Down to what outdoor temperature does an AC heat?", answer: "Entry models — to -7…-10 °C, where output already drops. Models for primary heating (Gree Amber/Soyal, Mitsubishi Heavy SRK, Daikin) run to -15…-25 °C with retained output." },
    ],
    ru: [
      { question: "Какую температуру ставить на кондиционере для обогрева?", answer: "21–23 °C. Более высокая настройка не греет быстрее, а лишь увеличивает счёт на 5–7 % за градус. Если холодно при 22 °C, направьте жалюзи вниз и проверьте, что вентилятор на Auto." },
      { question: "Почему кондиционер дует холодом в режиме тепла?", answer: "Первые 5–10 минут аппарат ждёт прогрева теплообменника и намеренно не дует. Если после этого всё равно дует холодом, проверьте, что режим Heat (солнце), а не Cool или Dry, и что не идёт цикл оттайки." },
      { question: "Наружный блок дымит и капает вода — это поломка?", answer: "Нет. При обогреве каждые 40–60 минут аппарат оттаивает наружный блок 3–5 минут — тогда из него идёт пар и капает вода. Это нормальный цикл defrost." },
      { question: "До какой температуры на улице греет кондиционер?", answer: "Базовые модели — до -7…-10 °C, где мощность уже падает. Модели для основного отопления (Gree Amber/Soyal, Mitsubishi Heavy SRK, Daikin) работают до -15…-25 °C с сохранением мощности." },
    ],
    ua: [
      { question: "Яку температуру ставити на кондиціонері для обігріву?", answer: "21–23 °C. Вища настройка не гріє швидше, а лише збільшує рахунок на 5–7 % за градус. Якщо холодно при 22 °C, спрямуйте жалюзі вниз і перевірте, що вентилятор на Auto." },
      { question: "Чому кондиціонер дме холодом у режимі тепла?", answer: "Перші 5–10 хвилин апарат чекає прогріву теплообмінника й навмисно не дме. Якщо після цього все одно дме холодом, перевірте, що режим Heat (сонце), а не Cool чи Dry, і що не йде цикл відтавання." },
      { question: "Зовнішній блок димить і капає вода — це поломка?", answer: "Ні. Під час обігріву кожні 40–60 хвилин апарат відтаює зовнішній блок 3–5 хвилин — тоді з нього йде пара й капає вода. Це нормальний цикл defrost." },
      { question: "До якої температури на вулиці гріє кондиціонер?", answer: "Базові моделі — до -7…-10 °C, де потужність уже падає. Моделі для основного опалення (Gree Amber/Soyal, Mitsubishi Heavy SRK, Daikin) працюють до -15…-25 °C зі збереженням потужності." },
    ],
  },
};
