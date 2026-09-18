import type { BlogPost } from "../types";

/* ------------------------------------------------------------------ */
/*  BG                                                                 */
/* ------------------------------------------------------------------ */
function ContentBG() {
  return (
    <>
      <p>
        „Безшумен“ климатик не съществува — има тихи. Разликата между 19 и 26 dB на вътрешното
        тяло е разликата между тиктакане на часовник и шепот, и точно тя определя дали ще спите
        с включен климатик в спалня в панелен блок. Ето какво реално правят режимите Quiet,
        Sleep и нощен, кои модели са тихи по паспорт и какво да направите, ако уредът ви е станал
        по-шумен, отколкото беше.
      </p>

      <h2>Какво означават децибелите на етикета</h2>
      <p>
        Производителят дава шум на вътрешното тяло на <strong>най-ниска степен</strong> — това е
        цифрата 19–22 dB в брошурата. На средна степен същият уред е 30–35 dB, на висока — 40–45 dB.
        За ориентир: 20 dB е тиха стая нощем, 30 dB — шепот на метър, 40 dB — тих разговор.
      </p>
      <p>
        Външното тяло е 45–55 dB и то е това, което чуват съседите. При монтаж на 1,5 м от
        спалня на съсед през тънка стена вибрациите се предават по конструкцията — за това има
        антивибрационни тампони, които слагаме стандартно.
      </p>

      <h2>Quiet / Silent режим — най-ниската степен на вентилатора</h2>
      <p>
        Бутон <strong>QUIET</strong> (Gree, AUX, Toshiba) или <strong>SILENT</strong> (Daikin,
        Mitsubishi) фиксира вентилатора на минимум и при повечето марки ограничава и оборотите на
        външното тяло. Резултат: 19–22 dB вътре, по-тихо и отвън, но и по-бавно достигане на
        температурата. Ползвайте го, <strong>след</strong> като стаята е охладена или затоплена, не
        от самото начало.
      </p>

      <h2>Sleep / нощен режим — не е същото</h2>
      <p>
        <strong>SLEEP</strong> прави три неща: намалява вентилатора, изключва дисплея и всеки час
        коригира температурата с 1 °C (нагоре при охлаждане, надолу при отопление) — общо с 2 °C за
        първите два часа, след което я държи. Идеята: тялото в сън има нужда от по-малко охлаждане,
        а уредът работи на по-ниска мощност и по-тихо. След 7–8 часа повечето модели се изключват
        сами.
      </p>
      <p>
        При Gree режимът е <strong>SLEEP</strong> с четири варианта (Sleep 1–4) в по-новите
        модели; при Daikin — <strong>NIGHT SET</strong>; при Mitsubishi Heavy —
        <strong> NIGHT SETBACK</strong>; при Toshiba — <strong>Comfort Sleep</strong>. Функцията е
        една и съща.
      </p>

      <h2>Кои модели са наистина тихи (по паспорт, на най-ниска степен)</h2>
      <ul>
        <li><strong>Mitsubishi Heavy SRK ZS / ZSX</strong> — 19 dB, най-честият ни избор за спалня.</li>
        <li><strong>Gree Soyal II / Amber</strong> — 19–20 dB.</li>
        <li><strong>Toshiba Super Daiseikai / Shorai Edge</strong> — 19–20 dB.</li>
        <li><strong>Daikin Stylish / Perfera</strong> — 19 dB.</li>
        <li><strong>Hitachi AirHome 400</strong> — 20 dB.</li>
        <li>Среден клас (Gree Airy, LG Standard, Toshiba Yukai) — 21–23 dB: напълно достатъчно за спалня в Sleep режим.</li>
        <li>Бюджетни (AUX, Nippon, Techpoint) — 24–27 dB: за хол и офис добре, за спалня при лек сън — по-скоро не.</li>
      </ul>

      <h2>Климатикът е станал по-шумен — 6 причини по честота</h2>
      <ol>
        <li><strong>Мръсни филтри и турбина.</strong> Прахът по лопатките нарушава баланса — появява се бръмчене и свистене. Филтрите се мият у дома; турбината се чисти при профилактика.</li>
        <li><strong>Пукане и щракане при старт и стоп.</strong> Пластмасата на корпуса се разширява от температурата. Нормално е, ако е кратко.</li>
        <li><strong>Бълбукане.</strong> Хладилният агент или кондензът в дренажа. При отопление е нормално; ако е постоянно през лятото — дренажът е запушен.</li>
        <li><strong>Вибрация на външното тяло.</strong> Разхлабени болтове на конзолата или износени тампони. Решава се за 20 минути на място.</li>
        <li><strong>Тракане на жалузите.</strong> Счупен зъб на мотора на жалузите — дребна част, сменя се.</li>
        <li><strong>Свирене на компресора.</strong> Единствената от шестте, която е сериозна — недостиг на хладилен агент или износване. Диагностика, не чакане.</li>
      </ol>

      <h2>Как да намалите шума без сервиз</h2>
      <ul>
        <li>Измийте филтрите на всеки 2–4 седмици в сезон — 5 минути с душ.</li>
        <li>Ползвайте <strong>Quiet</strong> след достигане на температурата, а не Low през цялото време.</li>
        <li>Не задавайте 18 °C през лятото — уредът работи на максимум и шуми. 24–26 °C + Dry дава същия комфорт.</li>
        <li>Проверете дали външното тяло не опира в парапет или стена.</li>
        <li>При монтаж поискайте вътрешното тяло да не е над таблата на леглото, а на страничната стена — шумът и въздушният поток са настрани от главата.</li>
      </ul>

      <h2>Ако избирате нов климатик за спалня</h2>
      <p>
        Търсете три цифри: <strong>шум ≤ 21 dB</strong>, <strong>SEER ≥ 7</strong> (тихият режим не
        бива да е и неефективен) и <strong>минимална мощност под 1 kW</strong> — това е способността на
        инвертора да работи „на тихо“, без да спира и пуска. Всичките ги показваме в характеристиките на
        всяка карточка в каталога, а сравнението по dB е в таблицата на всяка страница за марка.
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
        There is no “silent” air conditioner — there are quiet ones. The difference between 19
        and 26 dB on the indoor unit is the difference between a ticking clock and a whisper, and
        it decides whether you sleep with the AC on in a panel-block bedroom. Here is what the
        Quiet, Sleep and night modes actually do, which models are quiet on paper, and what to do
        when your unit has become louder than it used to be.
      </p>

      <h2>What the decibels on the label mean</h2>
      <p>
        Manufacturers quote indoor noise at the <strong>lowest fan speed</strong> — that is the
        19–22 dB figure in the brochure. At medium speed the same unit is 30–35 dB, at high 40–45 dB.
        For reference: 20 dB is a quiet room at night, 30 dB a whisper at one metre, 40 dB a quiet
        conversation.
      </p>
      <p>
        The outdoor unit is 45–55 dB and that is what the neighbours hear. Mounted 1.5 m from a
        neighbour’s bedroom through a thin wall, vibration travels through the structure — that is
        what anti-vibration pads are for, and we fit them as standard.
      </p>

      <h2>Quiet / Silent mode — the lowest fan speed</h2>
      <p>
        The <strong>QUIET</strong> button (Gree, AUX, Toshiba) or <strong>SILENT</strong> (Daikin,
        Mitsubishi) fixes the fan at minimum and on most brands also limits the outdoor unit’s
        speed. Result: 19–22 dB inside, quieter outside too, but slower to reach temperature. Use it
        <strong> after</strong> the room is cooled or heated, not from the start.
      </p>

      <h2>Sleep / night mode — not the same thing</h2>
      <p>
        <strong>SLEEP</strong> does three things: lowers the fan, switches off the display and adjusts
        the set point by 1 °C every hour (up when cooling, down when heating) — 2 °C in total over
        the first two hours, then holds. The idea: a sleeping body needs less cooling, and the unit
        runs at lower output and more quietly. After 7–8 hours most models switch off by themselves.
      </p>
      <p>
        Gree calls it <strong>SLEEP</strong> with four variants (Sleep 1–4) on newer models; Daikin
        <strong> NIGHT SET</strong>; Mitsubishi Heavy <strong>NIGHT SETBACK</strong>; Toshiba
        <strong> Comfort Sleep</strong>. Same function.
      </p>

      <h2>Which models are genuinely quiet (rated, lowest speed)</h2>
      <ul>
        <li><strong>Mitsubishi Heavy SRK ZS / ZSX</strong> — 19 dB, our most common bedroom pick.</li>
        <li><strong>Gree Soyal II / Amber</strong> — 19–20 dB.</li>
        <li><strong>Toshiba Super Daiseikai / Shorai Edge</strong> — 19–20 dB.</li>
        <li><strong>Daikin Stylish / Perfera</strong> — 19 dB.</li>
        <li><strong>Hitachi AirHome 400</strong> — 20 dB.</li>
        <li>Mid range (Gree Airy, LG Standard, Toshiba Yukai) — 21–23 dB: perfectly fine for a bedroom in Sleep mode.</li>
        <li>Budget (AUX, Nippon, Techpoint) — 24–27 dB: fine for a living room or office; for a light sleeper’s bedroom — rather not.</li>
      </ul>

      <h2>The AC got louder — 6 causes by frequency</h2>
      <ol>
        <li><strong>Dirty filters and fan wheel.</strong> Dust on the blades unbalances it — humming and whistling appear. Filters are washed at home; the fan wheel is cleaned at maintenance.</li>
        <li><strong>Cracking and clicking on start and stop.</strong> The plastic casing expands with temperature. Normal if brief.</li>
        <li><strong>Gurgling.</strong> Refrigerant or condensate in the drain. Normal when heating; if constant in summer, the drain is blocked.</li>
        <li><strong>Outdoor unit vibration.</strong> Loose bracket bolts or worn pads. Fixed in 20 minutes on site.</li>
        <li><strong>Rattling louvres.</strong> A broken tooth on the louvre motor — a small part, replaced.</li>
        <li><strong>Compressor whine.</strong> The only serious one of the six — refrigerant shortage or wear. Diagnostics, not waiting.</li>
      </ol>

      <h2>How to reduce noise without a service call</h2>
      <ul>
        <li>Wash the filters every 2–4 weeks in season — 5 minutes under the shower.</li>
        <li>Use <strong>Quiet</strong> after reaching temperature, not Low all the time.</li>
        <li>Do not set 18 °C in summer — the unit runs flat out and is loud. 24–26 °C + Dry gives the same comfort.</li>
        <li>Check that the outdoor unit does not touch a railing or wall.</li>
        <li>At installation ask for the indoor unit on the side wall, not above the headboard — noise and airflow stay away from your head.</li>
      </ul>

      <h2>If you are choosing a new AC for a bedroom</h2>
      <p>
        Look for three numbers: <strong>noise ≤ 21 dB</strong>, <strong>SEER ≥ 7</strong> (quiet
        mode should not also be inefficient) and <strong>minimum output below 1 kW</strong> — the
        inverter’s ability to run “quietly” without stopping and starting. All three are in the
        specs of every product card, and the dB comparison is in the table on every brand page.
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
        «Бесшумного» кондиционера не существует — есть тихие. Разница между 19 и 26 дБ внутреннего
        блока — это разница между тиканьем часов и шёпотом, и именно она решает, будете ли вы спать
        с включённым кондиционером в спальне панельного дома. Вот что на самом деле делают режимы
        Quiet, Sleep и ночной, какие модели тихие по паспорту и что делать, если аппарат стал
        шумнее, чем был.
      </p>

      <h2>Что означают децибелы на этикетке</h2>
      <p>
        Производитель указывает шум внутреннего блока на <strong>минимальной скорости</strong> — это
        цифра 19–22 дБ в брошюре. На средней скорости тот же аппарат — 30–35 дБ, на высокой — 40–45 дБ.
        Для ориентира: 20 дБ — тихая комната ночью, 30 дБ — шёпот с метра, 40 дБ — тихий разговор.
      </p>
      <p>
        Наружный блок — 45–55 дБ, и именно его слышат соседи. При монтаже в 1,5 м от спальни соседа
        через тонкую стену вибрация передаётся по конструкции — для этого есть антивибрационные
        подушки, которые мы ставим стандартно.
      </p>

      <h2>Quiet / Silent — минимальная скорость вентилятора</h2>
      <p>
        Кнопка <strong>QUIET</strong> (Gree, AUX, Toshiba) или <strong>SILENT</strong> (Daikin,
        Mitsubishi) фиксирует вентилятор на минимуме и у большинства марок ограничивает и обороты
        наружного блока. Результат: 19–22 дБ внутри, тише и снаружи, но медленнее выход на
        температуру. Используйте его <strong>после</strong> того, как комната охлаждена или прогрета,
        а не с самого начала.
      </p>

      <h2>Sleep / ночной режим — это не то же самое</h2>
      <p>
        <strong>SLEEP</strong> делает три вещи: снижает вентилятор, выключает дисплей и каждый час
        корректирует температуру на 1 °C (вверх при охлаждении, вниз при обогреве) — всего на 2 °C за
        первые два часа, затем держит. Идея: спящему телу нужно меньше охлаждения, а аппарат работает
        на меньшей мощности и тише. Через 7–8 часов большинство моделей выключаются сами.
      </p>
      <p>
        У Gree это <strong>SLEEP</strong> с четырьмя вариантами (Sleep 1–4) в новых моделях; у Daikin —
        <strong> NIGHT SET</strong>; у Mitsubishi Heavy — <strong>NIGHT SETBACK</strong>; у Toshiba —
        <strong> Comfort Sleep</strong>. Функция одна и та же.
      </p>

      <h2>Какие модели действительно тихие (по паспорту, на минимальной скорости)</h2>
      <ul>
        <li><strong>Mitsubishi Heavy SRK ZS / ZSX</strong> — 19 дБ, наш самый частый выбор для спальни.</li>
        <li><strong>Gree Soyal II / Amber</strong> — 19–20 дБ.</li>
        <li><strong>Toshiba Super Daiseikai / Shorai Edge</strong> — 19–20 дБ.</li>
        <li><strong>Daikin Stylish / Perfera</strong> — 19 дБ.</li>
        <li><strong>Hitachi AirHome 400</strong> — 20 дБ.</li>
        <li>Средний класс (Gree Airy, LG Standard, Toshiba Yukai) — 21–23 дБ: вполне достаточно для спальни в режиме Sleep.</li>
        <li>Бюджетные (AUX, Nippon, Techpoint) — 24–27 дБ: для гостиной и офиса хорошо, для спальни при чутком сне — скорее нет.</li>
      </ul>

      <h2>Кондиционер стал шумнее — 6 причин по частоте</h2>
      <ol>
        <li><strong>Грязные фильтры и турбина.</strong> Пыль на лопатках нарушает баланс — появляется гул и свист. Фильтры моются дома; турбина чистится при профилактике.</li>
        <li><strong>Потрескивание и щелчки при старте и остановке.</strong> Пластик корпуса расширяется от температуры. Нормально, если коротко.</li>
        <li><strong>Бульканье.</strong> Хладагент или конденсат в дренаже. При обогреве нормально; если постоянно летом — дренаж забит.</li>
        <li><strong>Вибрация наружного блока.</strong> Ослабленные болты кронштейна или изношенные подушки. Решается за 20 минут на месте.</li>
        <li><strong>Стук жалюзи.</strong> Сломанный зуб мотора жалюзи — мелкая деталь, меняется.</li>
        <li><strong>Свист компрессора.</strong> Единственная серьёзная из шести — нехватка хладагента или износ. Диагностика, а не ожидание.</li>
      </ol>

      <h2>Как снизить шум без сервиса</h2>
      <ul>
        <li>Мойте фильтры каждые 2–4 недели в сезон — 5 минут под душем.</li>
        <li>Используйте <strong>Quiet</strong> после достижения температуры, а не Low всё время.</li>
        <li>Не ставьте 18 °C летом — аппарат работает на максимуме и шумит. 24–26 °C + Dry даёт тот же комфорт.</li>
        <li>Проверьте, не упирается ли наружный блок в перила или стену.</li>
        <li>При монтаже попросите разместить внутренний блок на боковой стене, а не над изголовьем — шум и поток в стороне от головы.</li>
      </ul>

      <h2>Если выбираете новый кондиционер для спальни</h2>
      <p>
        Ищите три цифры: <strong>шум ≤ 21 дБ</strong>, <strong>SEER ≥ 7</strong> (тихий режим не
        должен быть ещё и неэффективным) и <strong>минимальная мощность ниже 1 кВт</strong> — это
        способность инвертора работать «тихо», не останавливаясь и не запускаясь заново. Все три есть в
        характеристиках каждой карточки, а сравнение по дБ — в таблице на странице каждой марки.
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
        «Безшумного» кондиціонера не існує — є тихі. Різниця між 19 і 26 дБ внутрішнього блока — це
        різниця між цоканням годинника й шепотом, і саме вона вирішує, чи будете ви спати з увімкненим
        кондиціонером у спальні панельного будинку. Ось що насправді роблять режими Quiet, Sleep і
        нічний, які моделі тихі за паспортом і що робити, якщо апарат став гучнішим, ніж був.
      </p>

      <h2>Що означають децибели на етикетці</h2>
      <p>
        Виробник вказує шум внутрішнього блока на <strong>мінімальній швидкості</strong> — це цифра
        19–22 дБ у брошурі. На середній швидкості той самий апарат — 30–35 дБ, на високій — 40–45 дБ.
        Для орієнтиру: 20 дБ — тиха кімната вночі, 30 дБ — шепіт з метра, 40 дБ — тиха розмова.
      </p>
      <p>
        Зовнішній блок — 45–55 дБ, і саме його чують сусіди. За монтажу за 1,5 м від спальні сусіда
        через тонку стіну вібрація передається конструкцією — для цього є антивібраційні подушки, які
        ми ставимо стандартно.
      </p>

      <h2>Quiet / Silent — мінімальна швидкість вентилятора</h2>
      <p>
        Кнопка <strong>QUIET</strong> (Gree, AUX, Toshiba) або <strong>SILENT</strong> (Daikin,
        Mitsubishi) фіксує вентилятор на мінімумі й у більшості марок обмежує й оберти зовнішнього
        блока. Результат: 19–22 дБ усередині, тихіше й зовні, але повільніший вихід на температуру.
        Використовуйте його <strong>після</strong> того, як кімната охолоджена чи прогріта, а не з
        самого початку.
      </p>

      <h2>Sleep / нічний режим — це не те саме</h2>
      <p>
        <strong>SLEEP</strong> робить три речі: знижує вентилятор, вимикає дисплей і щогодини коригує
        температуру на 1 °C (угору при охолодженні, вниз при обігріві) — загалом на 2 °C за перші дві
        години, потім тримає. Ідея: сплячому тілу потрібно менше охолодження, а апарат працює на меншій
        потужності й тихіше. Через 7–8 годин більшість моделей вимикаються самі.
      </p>
      <p>
        У Gree це <strong>SLEEP</strong> із чотирма варіантами (Sleep 1–4) у нових моделях; у Daikin —
        <strong> NIGHT SET</strong>; у Mitsubishi Heavy — <strong>NIGHT SETBACK</strong>; у Toshiba —
        <strong> Comfort Sleep</strong>. Функція та сама.
      </p>

      <h2>Які моделі справді тихі (за паспортом, на мінімальній швидкості)</h2>
      <ul>
        <li><strong>Mitsubishi Heavy SRK ZS / ZSX</strong> — 19 дБ, наш найчастіший вибір для спальні.</li>
        <li><strong>Gree Soyal II / Amber</strong> — 19–20 дБ.</li>
        <li><strong>Toshiba Super Daiseikai / Shorai Edge</strong> — 19–20 дБ.</li>
        <li><strong>Daikin Stylish / Perfera</strong> — 19 дБ.</li>
        <li><strong>Hitachi AirHome 400</strong> — 20 дБ.</li>
        <li>Середній клас (Gree Airy, LG Standard, Toshiba Yukai) — 21–23 дБ: цілком достатньо для спальні в режимі Sleep.</li>
        <li>Бюджетні (AUX, Nippon, Techpoint) — 24–27 дБ: для вітальні й офісу добре, для спальні за чутливого сну — радше ні.</li>
      </ul>

      <h2>Кондиціонер став гучнішим — 6 причин за частотою</h2>
      <ol>
        <li><strong>Брудні фільтри й турбіна.</strong> Пил на лопатях порушує баланс — з’являється гул і свист. Фільтри миються вдома; турбіна чиститься під час профілактики.</li>
        <li><strong>Потріскування й клацання при старті й зупинці.</strong> Пластик корпусу розширюється від температури. Нормально, якщо коротко.</li>
        <li><strong>Булькання.</strong> Холодоагент або конденсат у дренажі. При обігріві нормально; якщо постійно влітку — дренаж забитий.</li>
        <li><strong>Вібрація зовнішнього блока.</strong> Ослаблені болти кронштейна або зношені подушки. Вирішується за 20 хвилин на місці.</li>
        <li><strong>Стукіт жалюзі.</strong> Зламаний зуб мотора жалюзі — дрібна деталь, замінюється.</li>
        <li><strong>Свист компресора.</strong> Єдина серйозна із шести — нестача холодоагенту або знос. Діагностика, а не очікування.</li>
      </ol>

      <h2>Як знизити шум без сервісу</h2>
      <ul>
        <li>Мийте фільтри кожні 2–4 тижні в сезон — 5 хвилин під душем.</li>
        <li>Використовуйте <strong>Quiet</strong> після досягнення температури, а не Low увесь час.</li>
        <li>Не ставте 18 °C улітку — апарат працює на максимумі й шумить. 24–26 °C + Dry дає той самий комфорт.</li>
        <li>Перевірте, чи не впирається зовнішній блок у перила або стіну.</li>
        <li>Під час монтажу попросіть розмістити внутрішній блок на бічній стіні, а не над узголів’ям — шум і потік осторонь від голови.</li>
      </ul>

      <h2>Якщо обираєте новий кондиціонер для спальні</h2>
      <p>
        Шукайте три цифри: <strong>шум ≤ 21 дБ</strong>, <strong>SEER ≥ 7</strong> (тихий режим не має
        бути ще й неефективним) і <strong>мінімальна потужність нижче 1 кВт</strong> — це здатність
        інвертора працювати «тихо», не зупиняючись і не запускаючись знову. Усі три є в характеристиках
        кожної картки, а порівняння за дБ — у таблиці на сторінці кожної марки.
      </p>
    </>
  );
}

export const tihRezhimKlimatik: BlogPost = {
  slug: "tih-rezhim-klimatik",
  date: "2026-09-18",
  image: "/portfolio/05-maintenance-inside.jpg",
  readingTime: { bg: "6 мин", en: "6 min", ru: "6 мин", ua: "6 хв" },
  title: {
    bg: "Тих режим на климатика: Quiet, Sleep, нощен — какво правят и кои модели са наистина тихи",
    en: "Quiet mode on your AC: Quiet, Sleep, night — what they do and which models are genuinely quiet",
    ru: "Тихий режим кондиционера: Quiet, Sleep, ночной — что они делают и какие модели действительно тихие",
    ua: "Тихий режим кондиціонера: Quiet, Sleep, нічний — що вони роблять і які моделі справді тихі",
  },
  excerpt: {
    bg: "19 или 26 dB — разликата между сън и безсъние в панелен блок. Какво прави всеки режим, кои модели са тихи по паспорт и 6-те причини климатикът да е станал по-шумен.",
    en: "19 or 26 dB — the difference between sleep and no sleep in a panel block. What each mode does, which models are quiet on paper and the 6 reasons an AC gets louder.",
    ru: "19 или 26 дБ — разница между сном и бессонницей в панельном доме. Что делает каждый режим, какие модели тихие по паспорту и 6 причин, почему кондиционер стал шумнее.",
    ua: "19 чи 26 дБ — різниця між сном і безсонням у панельному будинку. Що робить кожен режим, які моделі тихі за паспортом і 6 причин, чому кондиціонер став гучнішим.",
  },
  keywords: {
    bg: ["безшумен режим на климатик", "тих климатик", "sleep режим климатик", "quiet режим климатик", "климатик шуми", "най-тих климатик за спалня"],
    en: ["AC quiet mode", "quietest air conditioner", "AC sleep mode", "air conditioner noisy", "quiet AC for bedroom"],
    ru: ["тихий режим кондиционера", "самый тихий кондиционер", "sleep режим кондиционер", "кондиционер шумит", "тихий кондиционер для спальни"],
    ua: ["тихий режим кондиціонера", "найтихіший кондиціонер", "sleep режим кондиціонер", "кондиціонер шумить", "тихий кондиціонер для спальні"],
  },
  content: { bg: ContentBG, en: ContentEN, ru: ContentRU, ua: ContentUA },
  faq: {
    bg: [
      { question: "Какво прави режим Sleep на климатика?", answer: "Намалява вентилатора, изключва дисплея и на всеки час коригира температурата с 1 °C (общо 2 °C), после я държи. След 7–8 часа повечето модели се изключват сами. Идеята е по-малко охлаждане и по-малко шум докато спите." },
      { question: "Кой е най-тихият климатик за спалня?", answer: "По паспорт на най-ниска степен: Mitsubishi Heavy SRK ZS/ZSX, Daikin Stylish/Perfera, Gree Soyal II/Amber и Toshiba Daiseikai — 19–20 dB. Среден клас на 21–23 dB също е подходящ в режим Sleep." },
      { question: "Защо климатикът е станал по-шумен?", answer: "Най-често — мръсни филтри и турбина, които нарушават баланса на вентилатора. След това: разхлабено външно тяло, запушен дренаж, счупен мотор на жалузите. Свистене на компресора е единствената сериозна причина — нужна е диагностика." },
      { question: "Колко децибела е нормално за климатик?", answer: "Вътрешно тяло: 19–22 dB на най-ниска степен, 30–35 dB на средна, 40–45 dB на висока. Външно тяло: 45–55 dB. 20 dB е тиха стая нощем, 30 dB — шепот." },
    ],
    en: [
      { question: "What does Sleep mode do on an AC?", answer: "It lowers the fan, switches off the display and adjusts the set point by 1 °C every hour (2 °C in total), then holds it. After 7–8 hours most models switch off by themselves. The point is less cooling and less noise while you sleep." },
      { question: "Which is the quietest AC for a bedroom?", answer: "Rated at lowest speed: Mitsubishi Heavy SRK ZS/ZSX, Daikin Stylish/Perfera, Gree Soyal II/Amber and Toshiba Daiseikai — 19–20 dB. Mid range at 21–23 dB is also fine in Sleep mode." },
      { question: "Why has my AC become louder?", answer: "Most often dirty filters and fan wheel unbalancing the fan. Then: a loose outdoor unit, a blocked drain, a broken louvre motor. Compressor whine is the only serious cause — it needs diagnostics." },
      { question: "How many decibels is normal for an AC?", answer: "Indoor unit: 19–22 dB at lowest speed, 30–35 dB at medium, 40–45 dB at high. Outdoor unit: 45–55 dB. 20 dB is a quiet room at night, 30 dB a whisper." },
    ],
    ru: [
      { question: "Что делает режим Sleep на кондиционере?", answer: "Снижает вентилятор, выключает дисплей и каждый час корректирует температуру на 1 °C (всего 2 °C), затем держит. Через 7–8 часов большинство моделей выключаются сами. Смысл — меньше охлаждения и меньше шума, пока вы спите." },
      { question: "Какой самый тихий кондиционер для спальни?", answer: "По паспорту на минимальной скорости: Mitsubishi Heavy SRK ZS/ZSX, Daikin Stylish/Perfera, Gree Soyal II/Amber и Toshiba Daiseikai — 19–20 дБ. Средний класс на 21–23 дБ тоже подходит в режиме Sleep." },
      { question: "Почему кондиционер стал шумнее?", answer: "Чаще всего — грязные фильтры и турбина, нарушающие баланс вентилятора. Затем: ослабленный наружный блок, забитый дренаж, сломанный мотор жалюзи. Свист компрессора — единственная серьёзная причина, нужна диагностика." },
      { question: "Сколько децибел нормально для кондиционера?", answer: "Внутренний блок: 19–22 дБ на минимальной скорости, 30–35 дБ на средней, 40–45 дБ на высокой. Наружный блок: 45–55 дБ. 20 дБ — тихая комната ночью, 30 дБ — шёпот." },
    ],
    ua: [
      { question: "Що робить режим Sleep на кондиціонері?", answer: "Знижує вентилятор, вимикає дисплей і щогодини коригує температуру на 1 °C (загалом 2 °C), потім тримає. Через 7–8 годин більшість моделей вимикаються самі. Сенс — менше охолодження й менше шуму, поки ви спите." },
      { question: "Який найтихіший кондиціонер для спальні?", answer: "За паспортом на мінімальній швидкості: Mitsubishi Heavy SRK ZS/ZSX, Daikin Stylish/Perfera, Gree Soyal II/Amber і Toshiba Daiseikai — 19–20 дБ. Середній клас на 21–23 дБ також підходить у режимі Sleep." },
      { question: "Чому кондиціонер став гучнішим?", answer: "Найчастіше — брудні фільтри й турбіна, що порушують баланс вентилятора. Далі: ослаблений зовнішній блок, забитий дренаж, зламаний мотор жалюзі. Свист компресора — єдина серйозна причина, потрібна діагностика." },
      { question: "Скільки децибел нормально для кондиціонера?", answer: "Внутрішній блок: 19–22 дБ на мінімальній швидкості, 30–35 дБ на середній, 40–45 дБ на високій. Зовнішній блок: 45–55 дБ. 20 дБ — тиха кімната вночі, 30 дБ — шепіт." },
    ],
  },
};
