import type { BlogPost } from "../types";

/* ------------------------------------------------------------------ */
/*  BG content                                                         */
/* ------------------------------------------------------------------ */
function ContentBG() {
  return (
    <>
      <h2>Защо изборът на климатик във Варна е различен</h2>
      <p>
        Варна не е София, не е Пловдив. Крайбрежният климат поставя специфични
        изисквания към климатичната техника, които повечето купувачи пропускат.
        Ако не ги отчетете — ще платите повече за ток, ще ремонтирате по-рано и
        ще останете недоволни.
      </p>

      <h3>Влажност 60-80% през цялото лято</h3>
      <p>
        Морският бриз носи влага. Влажността във Варна през юни-септември е
        постоянно 60-80%, докато в София рядко надхвърля 50%. Климатикът работи
        двойно — и охлажда, и изсушава въздуха. Това означава по-голямо натоварване
        на компресора и по-висока консумация, ако уредът е подоразмерен. Затова
        за Варна винаги оразмерявайте с малък резерв — поне 10% повече BTU спрямо
        стандартните калкулатори.
      </p>

      <h3>Солен въздух — врагът на външното тяло</h3>
      <p>
        На 2-3 км от морето солеността на въздуха ускорява корозията на
        кондензатора. Климатик без антикорозийно покритие (Golden Fin, Blue Fin)
        започва да ръждясва за 2-3 години. Ламелите се разрушават, ефективността
        пада, ремонтът е скъп. Ако живеете в морските квартали — Чайка, Бриз,
        Аспарухово, Галата — антикорозийната защита не е лукс, а необходимост.
      </p>

      <h3>Меки зими — климатикът като основно отопление</h3>
      <p>
        Средната температура през януари е +2...+3°C. Дни с минуси под -5°C се
        случват три-четири за цяла зима. Това прави инверторния климатик напълно
        подходящ за целогодишно отопление — нещо, което в континенталните градове
        е рисковано. За Варна е стандартна практика.
      </p>

      <h3>Панелни блокове — специфична изолация</h3>
      <p>
        Повечето жилища във Варна са панелни (ЕПЖБ). Без външна изолация
        топлинните загуби са до 40% по-високи. Ако блокът не е саниран, добавете
        20-30% към препоръчителните BTU. А ако имате стари дървени дограми —
        помислете за уплътняване преди да купувате климатик.
      </p>

      <h2>BTU калкулатор — колко мощност ви трябва</h2>
      <p>
        BTU (British Thermal Unit) е мерната единица за мощност на климатика.
        Повече BTU = повече площ може да обслужи. Но &quot;по-голям = по-добър&quot; не
        работи — преоразмереният климатик тактува (пали-гаси), губи ефективност
        и шуми повече.
      </p>

      <h3>Основно правило: 340 BTU на квадратен метър</h3>
      <p>
        За стандартно помещение с височина на тавана 2.60 м, средна изолация и
        едно южно прозорче, формулата е проста: площ x 340 = минимални BTU.
        Стая 20 кв.м = 6800 BTU, закръгляме нагоре до 9000 BTU.
      </p>

      <h3>Коригиращи фактори</h3>
      <ul>
        <li><strong>Южно изложение:</strong> +15% — слънцето грее директно и помещението се нагрява повече</li>
        <li><strong>Последен етаж:</strong> +10% — покривът предава допълнителна топлина</li>
        <li><strong>Лоша изолация / стар панел:</strong> +20% — топлината избягва навън</li>
        <li><strong>Кухня / много уреди:</strong> +10% — печката, хладилникът и фурната отделят топлина</li>
        <li><strong>Крайбрежна влажност (Варна):</strong> +10% — климатикът работи допълнително за изсушаване</li>
      </ul>

      <h3>Таблица: площ и препоръчителни BTU</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Площ на стаята</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Препоръчителни BTU</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Типичен модел</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">до 15 кв.м</td>
              <td className="text-center px-4 py-3 border border-border/60">9 000</td>
              <td className="text-center px-4 py-3 border border-border/60">9-ка</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">15-20 кв.м</td>
              <td className="text-center px-4 py-3 border border-border/60">9 000 – 12 000</td>
              <td className="text-center px-4 py-3 border border-border/60">9-ка или 12-ка</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">20-25 кв.м</td>
              <td className="text-center px-4 py-3 border border-border/60">12 000</td>
              <td className="text-center px-4 py-3 border border-border/60">12-ка</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">25-35 кв.м</td>
              <td className="text-center px-4 py-3 border border-border/60">12 000 – 18 000</td>
              <td className="text-center px-4 py-3 border border-border/60">12-ка или 18-ка</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">35-45 кв.м</td>
              <td className="text-center px-4 py-3 border border-border/60">18 000</td>
              <td className="text-center px-4 py-3 border border-border/60">18-ка</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">45-60 кв.м</td>
              <td className="text-center px-4 py-3 border border-border/60">24 000</td>
              <td className="text-center px-4 py-3 border border-border/60">24-ка</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Не сте сигурни колко BTU ви трябват? Нашият{" "}
        <a href="/" className="text-primary underline underline-offset-4 hover:text-primary/80">
          AI консултант
        </a>{" "}
        ще изчисли точно — кажете му квадратурата, етажа и изложението.
      </p>

      <h2>Инвертор срещу неинвертор</h2>
      <p>
        Тук няма дебат, но нека обясним защо. Инверторният компресор регулира
        оборотите плавно — като газта на кола. Неинверторният работи само на
        пълна мощност: пали, охлажда/загрява до зададената температура, гаси,
        чака температурата да се промени, пали пак.
      </p>

      <h3>Инверторен климатик</h3>
      <ul>
        <li><strong>30-50% по-малко ток</strong> — компресорът работи на минимални обороти повечето време</li>
        <li><strong>Стабилна температура</strong> — без колебания от 2-3 градуса</li>
        <li><strong>По-тих</strong> — при ниски обороти шумът е минимален</li>
        <li><strong>По-дълъг живот</strong> — без постоянно палене-гасене, което износва компресора</li>
        <li><strong>Ефективно отопление</strong> — работи и при -15°C до -25°C</li>
      </ul>

      <h3>Неинверторен климатик</h3>
      <ul>
        <li>По-евтин при покупка — с 300-500 лв разлика</li>
        <li>По-скъп за издръжка — 30-50% повече ток</li>
        <li>Шумен — компресорът работи само на максимум</li>
        <li>Неподходящ за отопление — при ниски температури просто спира</li>
      </ul>
      <p>
        <strong>Вердикт за Варна:</strong> само инвертор. Ако ще ползвате
        климатика и за отопление (а трябва — това е най-евтиният начин), инверторът
        е задължителен. Разликата в цената се изплаща за 1-2 отоплителни сезона.
      </p>

      <h2>Енергийни класове — какво означават SEER и SCOP</h2>
      <p>
        Етикетите A+, A++, A+++ не са маркетинг — зад тях стоят конкретни
        числа, които директно определят сметката ви за ток.
      </p>
      <ul>
        <li><strong>SEER</strong> (Seasonal Energy Efficiency Ratio) — ефективност при охлаждане. По-високо = по-евтино лято.</li>
        <li><strong>SCOP</strong> (Seasonal Coefficient of Performance) — ефективност при отопление. По-високо = по-евтина зима.</li>
      </ul>

      <h3>Какво казват числата</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Клас</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">SEER</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">SCOP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold text-green-700">A+++</td>
              <td className="text-center px-4 py-3 border border-border/60">&gt; 8.5</td>
              <td className="text-center px-4 py-3 border border-border/60">&gt; 5.1</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-semibold">A++</td>
              <td className="text-center px-4 py-3 border border-border/60">6.1 – 8.5</td>
              <td className="text-center px-4 py-3 border border-border/60">4.6 – 5.1</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">A+</td>
              <td className="text-center px-4 py-3 border border-border/60">5.6 – 6.1</td>
              <td className="text-center px-4 py-3 border border-border/60">4.0 – 4.6</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-semibold">A</td>
              <td className="text-center px-4 py-3 border border-border/60">5.1 – 5.6</td>
              <td className="text-center px-4 py-3 border border-border/60">3.4 – 4.0</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Конкретен пример: климатик A+++ срещу A+ при 8 месеца ползване спестява
        около <strong>200 лв годишно</strong> на ток. За 10 години живот — 2000 лв.
        Разликата в цената между A+ и A+++ модел рядко надхвърля 500-800 лв.
      </p>
      <p>
        <strong>За Варна:</strong> ако ще отоплявате с климатик (а трябва), SCOP е
        по-важен от SEER. Зимата е 5 месеца работа, лятото — 3. Фокусирайте се
        върху SCOP при избора.
      </p>

      <h2>Нива на шум — какво означават числата</h2>
      <p>
        Производителите посочват шума в децибели (dB). Но какво значат на практика?
      </p>
      <ul>
        <li><strong>&lt; 22 dB</strong> — шепот. Идеален за спалня. Няма да чуете климатика дори нощем.</li>
        <li><strong>22-28 dB</strong> — тих разговор. Подходящо за хол и кабинет.</li>
        <li><strong>28-35 dB</strong> — нормална стая. Чува се лек фон, но не дразни.</li>
        <li><strong>&gt; 35 dB</strong> — забележим шум. За спалня е твърде много.</li>
      </ul>
      <p>
        Тези числа са за <strong>вътрешното тяло</strong> на минимални обороти.
        На максимални шумът е с 5-10 dB повече. Проверявайте и двете стойности.
      </p>
      <p>
        <strong>Важно за апартаменти:</strong> не забравяйте шума на външното тяло.
        В панелен блок шумно външно тяло (над 55 dB) ще ядоса съседите. Премиум
        моделите на Daikin и Mitsubishi имат тихи компресори — 46-50 dB навън.
      </p>

      <h2>Какви марки се продават в България</h2>
      <p>
        Не всяка марка има оторизиран сервиз в страната. Без сервиз гаранцията
        е на хартия — ако нещо се счупи, няма кой да го поправи с оригинални части.
      </p>

      <h3>Премиум сегмент</h3>
      <p>
        <strong>Daikin</strong> и <strong>Mitsubishi Electric</strong> — японско
        качество, тихи компресори, висок SCOP, антикорозийно покритие в стандартната
        комплектация. Цена: от 2200 лв за 12-ка с монтаж. Отлична сервизна мрежа
        в цяла България.
      </p>

      <h3>Среден клас</h3>
      <p>
        <strong>Toshiba</strong> и <strong>Gree</strong> — страхотно съотношение
        цена/качество. Gree е най-големият производител в света — знаят какво
        правят. Toshiba — японска надеждност на достъпна цена. Цена: от 1500 лв
        за 12-ка с монтаж. Добра сервизна мрежа.
      </p>

      <h3>Бюджетен сегмент</h3>
      <p>
        <strong>AUX</strong>, <strong>Midea</strong>, <strong>TechPoint</strong> —
        прилично качество за парите. AUX се произвежда в заводите на Midea (втори
        по големина в света). Цена: от 1100 лв за 12-ка с монтаж. Сервизът е
        наличен, но мрежата е по-ограничена.
      </p>
      <p>
        <strong>Правило:</strong> купувайте само марки с оторизиран сервиз в
        България. &quot;Ноунейм&quot; от интернет може да изглежда изгодно, но при
        проблем с компресора ще платите колкото нов климатик.
      </p>
      <p>
        Вижте{" "}
        <a href="/catalog" className="text-primary underline underline-offset-4 hover:text-primary/80">
          актуалните цени и наличности в каталога
        </a>.
      </p>

      <h2>Монтажът е по-важен от марката</h2>
      <p>
        Можете да купите най-скъпия Daikin, но ако монтажът е зле направен — ще
        имате проблеми. Лошият монтаж е причина номер едно за рекламации и
        недоволство.
      </p>

      <h3>Какво може да се обърка</h3>
      <ul>
        <li><strong>Без вакуумиране:</strong> влага в системата разрушава компресора отвътре. Гаранцията отпада.</li>
        <li><strong>Лоша изолация на тръбите:</strong> конденз, капене, загуба на ефективност до 15%.</li>
        <li><strong>Грешен наклон на дренажа:</strong> водата се връща и капе от вътрешното тяло.</li>
        <li><strong>Къс тръбопровод, без запас:</strong> вибрации, шум, напрежение в съединенията.</li>
        <li><strong>Навиване на тръби под остър ъгъл:</strong> нарушава циркулацията на фреона.</li>
      </ul>

      <h3>Какво трябва да поискате</h3>
      <ul>
        <li>Вакуумиране минимум 15-20 минути с манометър</li>
        <li>Изолация с UV-устойчива пяна по цялата дължина на тръбите</li>
        <li>Правилен наклон на дренажа (минимум 1 см на метър)</li>
        <li>Стабилна конзола за външното тяло с антивибрационни подложки</li>
        <li>Проверка за херметичност след монтажа</li>
      </ul>
      <p>
        Нашият монтаж е с <strong>наш екип — не с подизпълнители</strong>. Знаем
        кой монтира и носим отговорност. 12 месеца гаранция на труда, плюс пълната
        фабрична гаранция на уреда.
      </p>

      <h2>Чеклист преди покупка</h2>
      <ul>
        <li>Измерете стаята в квадратни метри (дължина x ширина)</li>
        <li>Отбележете изложението — юг = повече слънце = повече BTU</li>
        <li>Последен етаж ли е? Добавете 10% BTU</li>
        <li>За какво ще ползвате — само охлаждане или и отопление?</li>
        <li>Спалня ли е? Търсете шум под 25 dB</li>
        <li>Определете бюджет за уред + монтаж (не пестете от монтажа)</li>
        <li>Проверете дали марката има оторизиран сервиз в България</li>
        <li>Попитайте за антикорозийно покритие — за Варна е задължително</li>
      </ul>
      <p>
        Готови ли сте? Започнете с нашия{" "}
        <a href="/" className="text-primary underline underline-offset-4 hover:text-primary/80">
          AI консултант
        </a>{" "}
        — ще ви помогне да изберете точния модел за вашата стая и бюджет.
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
      <h2>Why choosing an AC in Varna is different</h2>
      <p>
        Varna is not a typical inland city. The coastal microclimate creates
        specific demands on air conditioning equipment that most buyers overlook.
        Ignore them and you will pay more on electricity, face earlier repairs,
        and wonder why the unit struggles.
      </p>

      <h3>Humidity at 60-80% all summer</h3>
      <p>
        Sea breeze brings constant moisture. Summer humidity in Varna stays at
        60-80%, while Sofia rarely exceeds 50%. Your AC works double duty —
        cooling AND dehumidifying. That means heavier compressor load and higher
        power consumption if the unit is undersized. For Varna, always size with
        a buffer — at least 10% more BTU than standard calculators suggest.
      </p>

      <h3>Salt air — the outdoor unit killer</h3>
      <p>
        Within 2-3 km of the coast, salt in the air accelerates corrosion of the
        condenser coils. An AC without anti-corrosion coating (Golden Fin, Blue
        Fin technology) starts rusting within 2-3 years. Fins deteriorate,
        efficiency drops, repair costs pile up. If you live in seaside
        neighborhoods — Chaika, Briz, Asparuhovo, Galata — anti-corrosion
        protection is a necessity, not a luxury.
      </p>

      <h3>Mild winters — AC as primary heating</h3>
      <p>
        Average January temperature is +2...+3°C. Days below -5°C happen three
        or four times per winter. This makes an inverter AC perfectly viable as
        your sole heating source — something risky in continental cities but
        standard practice in Varna.
      </p>

      <h3>Panel buildings — specific insulation profile</h3>
      <p>
        Most apartments in Varna are Soviet-era panel buildings (panelni blokove).
        Without external insulation, heat losses run up to 40% higher than
        insulated buildings. If your building has not been renovated, add 20-30%
        to the recommended BTU. Old wooden window frames? Consider sealing them
        before investing in an AC.
      </p>

      <h2>BTU calculator — how much power do you need</h2>
      <p>
        BTU (British Thermal Unit) measures the cooling/heating capacity of an AC.
        More BTU means more area it can handle. But oversizing is just as bad as
        undersizing — an oversized unit short-cycles (turns on and off
        repeatedly), loses efficiency, and makes more noise.
      </p>

      <h3>Rule of thumb: 340 BTU per m2</h3>
      <p>
        For a standard room with 2.60 m ceiling height, average insulation, and
        one south-facing window, the formula is simple: area x 340 = minimum BTU.
        A 20 m2 room = 6,800 BTU, rounded up to the standard 9,000 BTU unit.
      </p>

      <h3>Adjustment factors</h3>
      <ul>
        <li><strong>South-facing windows:</strong> +15% — direct sun adds significant heat load</li>
        <li><strong>Top floor:</strong> +10% — the roof transfers additional heat</li>
        <li><strong>Poor insulation / old panel building:</strong> +20% — heat escapes through walls</li>
        <li><strong>Kitchen / heat-generating appliances:</strong> +10% — oven, stove, and fridge add heat</li>
        <li><strong>Coastal humidity (Varna):</strong> +10% — extra work for dehumidification</li>
      </ul>

      <h3>Room size to BTU guide</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Room size</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Recommended BTU</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Typical unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">Up to 15 m2</td>
              <td className="text-center px-4 py-3 border border-border/60">9,000</td>
              <td className="text-center px-4 py-3 border border-border/60">9K</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">15-20 m2</td>
              <td className="text-center px-4 py-3 border border-border/60">9,000 – 12,000</td>
              <td className="text-center px-4 py-3 border border-border/60">9K or 12K</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">20-25 m2</td>
              <td className="text-center px-4 py-3 border border-border/60">12,000</td>
              <td className="text-center px-4 py-3 border border-border/60">12K</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">25-35 m2</td>
              <td className="text-center px-4 py-3 border border-border/60">12,000 – 18,000</td>
              <td className="text-center px-4 py-3 border border-border/60">12K or 18K</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">35-45 m2</td>
              <td className="text-center px-4 py-3 border border-border/60">18,000</td>
              <td className="text-center px-4 py-3 border border-border/60">18K</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">45-60 m2</td>
              <td className="text-center px-4 py-3 border border-border/60">24,000</td>
              <td className="text-center px-4 py-3 border border-border/60">24K</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Not sure what BTU you need? Our{" "}
        <a href="/" className="text-primary underline underline-offset-4 hover:text-primary/80">
          AI consultant
        </a>{" "}
        will calculate it — just tell it your room size, floor, and orientation.
      </p>

      <h2>Inverter vs non-inverter</h2>
      <p>
        There is no real debate here, but let us explain why. An inverter
        compressor adjusts its speed smoothly — like a car accelerator. A
        non-inverter runs at full blast, shuts off when the target temperature
        is reached, waits for the temperature to drift, then fires up at full
        blast again.
      </p>

      <h3>Inverter AC advantages</h3>
      <ul>
        <li><strong>30-50% less electricity</strong> — the compressor runs at minimum speed most of the time</li>
        <li><strong>Stable temperature</strong> — no 2-3 degree swings</li>
        <li><strong>Quieter</strong> — low-speed operation means minimal noise</li>
        <li><strong>Longer lifespan</strong> — no constant start-stop cycles wearing out the compressor</li>
        <li><strong>Effective heating</strong> — works down to -15°C or even -25°C</li>
      </ul>

      <h3>Non-inverter AC drawbacks</h3>
      <ul>
        <li>Cheaper to buy — 150-250 EUR less</li>
        <li>More expensive to run — 30-50% higher electricity bills</li>
        <li>Noisier — the compressor only runs at maximum</li>
        <li>Poor for heating — simply shuts off at low temperatures</li>
      </ul>
      <p>
        <strong>Verdict for Varna:</strong> inverter only. If you plan to use the
        AC for heating (and you should — it is the cheapest way), inverter is
        mandatory. The price difference pays for itself in 1-2 heating seasons.
      </p>

      <h2>Energy classes — what SEER and SCOP mean</h2>
      <p>
        Those A+, A++, A+++ labels are not marketing — they represent specific
        efficiency numbers that directly affect your electricity bill.
      </p>
      <ul>
        <li><strong>SEER</strong> (Seasonal Energy Efficiency Ratio) — cooling efficiency. Higher = cheaper summer.</li>
        <li><strong>SCOP</strong> (Seasonal Coefficient of Performance) — heating efficiency. Higher = cheaper winter.</li>
      </ul>

      <h3>What the numbers mean</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Class</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">SEER</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">SCOP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold text-green-700">A+++</td>
              <td className="text-center px-4 py-3 border border-border/60">&gt; 8.5</td>
              <td className="text-center px-4 py-3 border border-border/60">&gt; 5.1</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-semibold">A++</td>
              <td className="text-center px-4 py-3 border border-border/60">6.1 – 8.5</td>
              <td className="text-center px-4 py-3 border border-border/60">4.6 – 5.1</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">A+</td>
              <td className="text-center px-4 py-3 border border-border/60">5.6 – 6.1</td>
              <td className="text-center px-4 py-3 border border-border/60">4.0 – 4.6</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-semibold">A</td>
              <td className="text-center px-4 py-3 border border-border/60">5.1 – 5.6</td>
              <td className="text-center px-4 py-3 border border-border/60">3.4 – 4.0</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Real-world example: an A+++ unit versus A+ saves roughly <strong>200 BGN
        per year</strong> on electricity with 8 months of use. Over a 10-year
        lifespan, that is 2,000 BGN. The price gap between A+ and A+++ rarely
        exceeds 500-800 BGN.
      </p>
      <p>
        <strong>For Varna:</strong> if you heat with your AC (and you should),
        SCOP matters more than SEER. Winter is 5 months of operation, summer is 3.
        Prioritize SCOP when choosing.
      </p>

      <h2>Noise levels — what the numbers mean</h2>
      <p>
        Manufacturers list noise in decibels (dB). Here is what they mean in real
        life:
      </p>
      <ul>
        <li><strong>&lt; 22 dB</strong> — a whisper. Perfect for bedrooms. You will not hear the AC even at night.</li>
        <li><strong>22-28 dB</strong> — quiet conversation. Fine for living rooms and offices.</li>
        <li><strong>28-35 dB</strong> — normal room ambiance. A light hum, not annoying.</li>
        <li><strong>&gt; 35 dB</strong> — noticeable. Too loud for bedrooms.</li>
      </ul>
      <p>
        These numbers are for the <strong>indoor unit at minimum speed</strong>.
        At maximum speed, add 5-10 dB. Always check both values.
      </p>
      <p>
        <strong>Important for apartments:</strong> do not forget the outdoor unit
        noise. In a panel building, a loud outdoor unit (above 55 dB) will
        irritate your neighbors. Premium Daikin and Mitsubishi models have quiet
        compressors — 46-50 dB outside.
      </p>

      <h2>Which brands are available in Bulgaria</h2>
      <p>
        Not every brand has authorized service in the country. Without local
        service, your warranty is just paper — if the compressor fails, nobody
        can fix it with original parts.
      </p>

      <h3>Premium tier</h3>
      <p>
        <strong>Daikin</strong> and <strong>Mitsubishi Electric</strong> —
        Japanese engineering, whisper-quiet compressors, high SCOP, anti-corrosion
        coating included. Price: from 2,200 BGN for a 12K unit with installation.
        Excellent service network across Bulgaria.
      </p>

      <h3>Mid-range</h3>
      <p>
        <strong>Toshiba</strong> and <strong>Gree</strong> — outstanding
        price-to-quality ratio. Gree is the world&#39;s largest AC manufacturer —
        they know what they are doing. Toshiba offers Japanese reliability at an
        accessible price. From 1,500 BGN for 12K with installation. Good service
        network.
      </p>

      <h3>Budget tier</h3>
      <p>
        <strong>AUX</strong>, <strong>Midea</strong>, <strong>TechPoint</strong> —
        decent quality for the money. AUX is manufactured in Midea factories
        (world&#39;s second-largest AC maker). From 1,100 BGN for 12K with
        installation. Service is available but the network is smaller.
      </p>
      <p>
        <strong>Rule:</strong> only buy brands with authorized service in
        Bulgaria. A no-name unit from the internet might look like a bargain, but
        one compressor failure and you will pay as much as a new unit.
      </p>
      <p>
        Check{" "}
        <a href="/catalog" className="text-primary underline underline-offset-4 hover:text-primary/80">
          current prices and availability in our catalog
        </a>.
      </p>

      <h2>Installation matters more than the brand</h2>
      <p>
        You can buy the most expensive Daikin, but if the installation is botched,
        you will have problems. Poor installation is the number one cause of
        complaints and dissatisfaction.
      </p>

      <h3>What can go wrong</h3>
      <ul>
        <li><strong>No vacuum evacuation:</strong> moisture in the system destroys the compressor from inside. Warranty voided.</li>
        <li><strong>Poor pipe insulation:</strong> condensation, dripping, up to 15% efficiency loss.</li>
        <li><strong>Wrong drain slope:</strong> water flows back and drips from the indoor unit.</li>
        <li><strong>Short piping without slack:</strong> vibrations, noise, stress on joints.</li>
        <li><strong>Sharp bends in the pipes:</strong> disrupts refrigerant flow.</li>
      </ul>

      <h3>What to look for</h3>
      <ul>
        <li>Vacuum evacuation for at least 15-20 minutes with a pressure gauge</li>
        <li>UV-resistant foam insulation along the entire pipe length</li>
        <li>Proper drain slope (minimum 1 cm per meter)</li>
        <li>Sturdy outdoor unit bracket with anti-vibration pads</li>
        <li>Leak test after installation</li>
      </ul>
      <p>
        Our installations are done by <strong>our own crew — no
        subcontractors</strong>. We know who installs and we take responsibility.
        12 months labor warranty, plus full factory warranty on the unit.
      </p>

      <h2>Checklist before buying</h2>
      <ul>
        <li>Measure your room in square meters (length x width)</li>
        <li>Note the orientation — south = more sun = more BTU needed</li>
        <li>Is it the top floor? Add 10% BTU</li>
        <li>Primary use: cooling only or heating too?</li>
        <li>Is it a bedroom? Look for noise below 25 dB</li>
        <li>Set a budget for unit + installation (do not skimp on installation)</li>
        <li>Check if the brand has authorized service in Bulgaria</li>
        <li>Ask about anti-corrosion coating — mandatory for Varna</li>
      </ul>
      <p>
        Ready to choose? Start with our{" "}
        <a href="/" className="text-primary underline underline-offset-4 hover:text-primary/80">
          AI consultant
        </a>{" "}
        — it will help you find the right model for your room and budget.
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
      <h2>Почему выбор кондиционера в Варне — это другая история</h2>
      <p>
        Варна — не Москва, не Минск и даже не София. Приморский климат
        предъявляет специфические требования к кондиционерам, которые
        большинство покупателей не учитывает. Результат — переплата за
        электричество, ранний ремонт и разочарование.
      </p>

      <h3>Влажность 60-80% все лето</h3>
      <p>
        Морской бриз несет влагу. Летняя влажность в Варне постоянно держится
        на 60-80%, тогда как в Софии редко превышает 50%. Кондиционер работает
        вдвойне — и охлаждает, и осушает воздух. Это дополнительная нагрузка
        на компрессор и повышенное потребление электроэнергии при недостаточной
        мощности. Для Варны всегда закладывайте запас — минимум 10% сверх
        стандартных расчетов.
      </p>

      <h3>Соленый воздух — враг наружного блока</h3>
      <p>
        В радиусе 2-3 км от моря соль в воздухе ускоряет коррозию конденсатора.
        Кондиционер без антикоррозийного покрытия (Golden Fin, Blue Fin) начинает
        ржаветь через 2-3 года. Ламели разрушаются, эффективность падает, ремонт
        дорогой. Живете в приморских районах — Чайка, Бриз, Аспарухово, Галата?
        Антикоррозийная защита — не роскошь, а необходимость.
      </p>

      <h3>Мягкие зимы — кондиционер как основное отопление</h3>
      <p>
        Средняя температура января +2...+3°C. Дней ниже -5°C за всю зиму
        набирается три-четыре. Это делает инверторный кондиционер полностью
        пригодным для круглогодичного отопления в Болгарии. В Москве или Минске
        это рискованно. В Варне — стандартная практика.
      </p>

      <h3>Панельные дома — знакомая история</h3>
      <p>
        Большинство жилья в Варне — панельные дома, очень похожие на наши.
        Без наружного утепления теплопотери на 30-40% выше нормы. Если дом
        не утеплен, добавляйте 20-30% к рекомендованным BTU. А если рамы
        деревянные и старые — задумайтесь об уплотнении до покупки кондиционера.
      </p>

      <h2>Калькулятор BTU — сколько мощности нужно</h2>
      <p>
        BTU (British Thermal Unit) — единица мощности кондиционера. Больше
        BTU = большую площадь обслуживает. Но &quot;чем больше, тем лучше&quot; здесь
        не работает — пересчитанный кондиционер тактует (включается-выключается),
        теряет эффективность и шумит больше.
      </p>

      <h3>Базовое правило: 340 BTU на квадратный метр</h3>
      <p>
        Для стандартного помещения с потолками 2.60 м, средней теплоизоляцией
        и одним южным окном: площадь x 340 = минимальные BTU. Комната 20 м² =
        6800 BTU, округляем вверх до стандартных 9000.
      </p>

      <h3>Поправочные коэффициенты</h3>
      <ul>
        <li><strong>Южная сторона:</strong> +15% — прямое солнце добавляет тепловую нагрузку</li>
        <li><strong>Последний этаж:</strong> +10% — крыша передает дополнительное тепло</li>
        <li><strong>Плохая изоляция / старая панелька:</strong> +20% — тепло уходит через стены</li>
        <li><strong>Кухня / много техники:</strong> +10% — плита, духовка и холодильник выделяют тепло</li>
        <li><strong>Приморская влажность (Варна):</strong> +10% — дополнительная работа на осушение</li>
      </ul>

      <h3>Таблица: площадь и рекомендованные BTU</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Площадь</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Рекоменд. BTU</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Типовая модель</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">до 15 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">9 000</td>
              <td className="text-center px-4 py-3 border border-border/60">девятка</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">15-20 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">9 000 – 12 000</td>
              <td className="text-center px-4 py-3 border border-border/60">9-ка или 12-ка</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">20-25 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">12 000</td>
              <td className="text-center px-4 py-3 border border-border/60">двенашка</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">25-35 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">12 000 – 18 000</td>
              <td className="text-center px-4 py-3 border border-border/60">12-ка или 18-ка</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">35-45 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">18 000</td>
              <td className="text-center px-4 py-3 border border-border/60">восемнашка</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">45-60 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">24 000</td>
              <td className="text-center px-4 py-3 border border-border/60">двадцать четвёрка</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Не уверены, сколько BTU нужно? Наш{" "}
        <a href="/" className="text-primary underline underline-offset-4 hover:text-primary/80">
          AI-консультант
        </a>{" "}
        рассчитает точно — скажите ему площадь, этаж и сторону света.
      </p>

      <h2>Инвертор или обычный — что выбрать</h2>
      <p>
        Тут дискуссии нет, но объясним почему. Инверторный компрессор плавно
        регулирует обороты — как педаль газа в машине. Обычный (on/off) работает
        только на полную: включился, охладил/нагрел, выключился, подождал, пока
        температура уйдет от заданной, снова включился на полную.
      </p>

      <h3>Инверторный кондиционер</h3>
      <ul>
        <li><strong>30-50% меньше электричества</strong> — компрессор работает на минимальных оборотах большую часть времени</li>
        <li><strong>Стабильная температура</strong> — без скачков на 2-3 градуса</li>
        <li><strong>Тише</strong> — на низких оборотах шум минимальный</li>
        <li><strong>Дольше служит</strong> — без постоянных пусков, изнашивающих компрессор</li>
        <li><strong>Эффективный обогрев</strong> — работает при -15°C и даже -25°C</li>
      </ul>

      <h3>Обычный (неинверторный) кондиционер</h3>
      <ul>
        <li>Дешевле при покупке — разница 300-500 лв (150-250 евро)</li>
        <li>Дороже в эксплуатации — на 30-50% больше электричества</li>
        <li>Шумный — компрессор только на максимуме</li>
        <li>Не годится для отопления — при низких температурах просто выключается</li>
      </ul>
      <p>
        <strong>Вердикт для Варны:</strong> только инвертор. Если вы будете
        использовать кондиционер для отопления (а это самый дешевый способ
        в Болгарии), инвертор обязателен. Разница в цене отбивается за 1-2
        отопительных сезона.
      </p>

      <h2>Энергоклассы — что значат SEER и SCOP</h2>
      <p>
        Этикетки A+, A++, A+++ — не маркетинг. За ними стоят конкретные
        цифры, напрямую влияющие на счет за электричество.
      </p>
      <ul>
        <li><strong>SEER</strong> (Seasonal Energy Efficiency Ratio) — эффективность охлаждения. Выше = дешевле лето.</li>
        <li><strong>SCOP</strong> (Seasonal Coefficient of Performance) — эффективность обогрева. Выше = дешевле зима.</li>
      </ul>

      <h3>Что показывают цифры</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Класс</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">SEER</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">SCOP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold text-green-700">A+++</td>
              <td className="text-center px-4 py-3 border border-border/60">&gt; 8.5</td>
              <td className="text-center px-4 py-3 border border-border/60">&gt; 5.1</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-semibold">A++</td>
              <td className="text-center px-4 py-3 border border-border/60">6.1 – 8.5</td>
              <td className="text-center px-4 py-3 border border-border/60">4.6 – 5.1</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">A+</td>
              <td className="text-center px-4 py-3 border border-border/60">5.6 – 6.1</td>
              <td className="text-center px-4 py-3 border border-border/60">4.0 – 4.6</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-semibold">A</td>
              <td className="text-center px-4 py-3 border border-border/60">5.1 – 5.6</td>
              <td className="text-center px-4 py-3 border border-border/60">3.4 – 4.0</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Конкретный пример: кондиционер A+++ против A+ при 8 месяцах использования
        экономит порядка <strong>200 лв в год</strong> на электричестве. За 10 лет —
        2000 лв (примерно 1000 евро). Разница в цене между A+ и A+++ моделью
        редко превышает 500-800 лв.
      </p>
      <p>
        <strong>Для Варны:</strong> если вы отапливаете кондиционером (а стоит —
        это самый экономный способ в Болгарии), SCOP важнее SEER. Зима — 5
        месяцев работы, лето — 3. При выборе смотрите на SCOP в первую очередь.
      </p>

      <h2>Уровень шума — что значат цифры</h2>
      <p>
        Производители указывают шум в децибелах (дБ). Вот что они означают на
        практике:
      </p>
      <ul>
        <li><strong>&lt; 22 дБ</strong> — шепот. Идеально для спальни. Кондиционера не услышите даже ночью.</li>
        <li><strong>22-28 дБ</strong> — тихий разговор. Подходит для гостиной и кабинета.</li>
        <li><strong>28-35 дБ</strong> — обычная комната. Легкий фон, не раздражает.</li>
        <li><strong>&gt; 35 дБ</strong> — заметный шум. Для спальни — много.</li>
      </ul>
      <p>
        Эти цифры — для <strong>внутреннего блока на минимальных оборотах</strong>.
        На максимальных прибавьте 5-10 дБ. Всегда проверяйте оба значения.
      </p>
      <p>
        <strong>Важно для квартир в Болгарии:</strong> не забывайте про шум
        наружного блока. В панельном доме шумный наружник (свыше 55 дБ) будет
        раздражать соседей. Премиальные модели Daikin и Mitsubishi — 46-50 дБ снаружи.
      </p>

      <h2>Какие бренды продаются в Болгарии</h2>
      <p>
        Не у каждого бренда есть авторизованный сервис в стране. Без сервиса
        гарантия — бумажка. Если что-то сломается — оригинальных запчастей нет,
        чинить некому.
      </p>

      <h3>Премиум-сегмент</h3>
      <p>
        <strong>Daikin</strong> и <strong>Mitsubishi Electric</strong> — японское
        качество, тишайшие компрессоры, высокий SCOP, антикоррозийное покрытие
        в стандарте. Цена: от 2200 лв за двенашку с монтажом (~1100 евро).
        Отличная сервисная сеть по всей Болгарии.
      </p>

      <h3>Средний сегмент</h3>
      <p>
        <strong>Toshiba</strong> и <strong>Gree</strong> — отличное соотношение
        цена/качество. Gree — крупнейший производитель кондиционеров в мире.
        Toshiba — японская надежность по доступной цене. От 1500 лв за двенашку
        с монтажом (~750 евро). Хорошая сервисная сеть.
      </p>

      <h3>Бюджетный сегмент</h3>
      <p>
        <strong>AUX</strong>, <strong>Midea</strong>, <strong>TechPoint</strong> —
        приличное качество за свои деньги. AUX производится на заводах Midea
        (второй по величине производитель в мире). От 1100 лв за двенашку с
        монтажом (~550 евро). Сервис есть, но сеть скромнее.
      </p>
      <p>
        <strong>Правило:</strong> покупайте только бренды с авторизованным
        сервисом в Болгарии. &quot;Ноунейм&quot; из интернета может казаться выгодным,
        но при поломке компрессора заплатите как за новый кондиционер.
      </p>
      <p>
        Смотрите{" "}
        <a href="/catalog" className="text-primary underline underline-offset-4 hover:text-primary/80">
          актуальные цены и наличие в каталоге
        </a>.
      </p>

      <h2>Монтаж важнее бренда</h2>
      <p>
        Можно купить самый дорогой Daikin, но если монтаж сделан криво —
        проблемы гарантированы. Плохой монтаж — причина номер один рекламаций
        и недовольства.
      </p>

      <h3>Что может пойти не так</h3>
      <ul>
        <li><strong>Без вакуумирования:</strong> влага в системе разрушает компрессор изнутри. Гарантия аннулируется.</li>
        <li><strong>Плохая изоляция труб:</strong> конденсат, капает, потеря эффективности до 15%.</li>
        <li><strong>Неправильный уклон дренажа:</strong> вода возвращается и капает из внутреннего блока.</li>
        <li><strong>Короткая трасса без запаса:</strong> вибрации, шум, напряжение в соединениях.</li>
        <li><strong>Загибы труб под острым углом:</strong> нарушает циркуляцию фреона.</li>
      </ul>

      <h3>Что требовать от монтажника</h3>
      <ul>
        <li>Вакуумирование минимум 15-20 минут с манометром</li>
        <li>Изоляция UV-устойчивой пеной по всей длине трассы</li>
        <li>Правильный уклон дренажа (минимум 1 см на метр)</li>
        <li>Надежный кронштейн для наружного блока с антивибрационными подушками</li>
        <li>Проверка герметичности после монтажа</li>
      </ul>
      <p>
        Наш монтаж — <strong>своя бригада, не субподрядчики</strong>. Мы знаем,
        кто монтирует, и несем ответственность. 12 месяцев гарантии на работу,
        плюс полная заводская гарантия на оборудование.
      </p>

      <h2>Чек-лист перед покупкой</h2>
      <ul>
        <li>Измерьте комнату в квадратных метрах (длина x ширина)</li>
        <li>Запишите ориентацию — юг = больше солнца = больше BTU</li>
        <li>Последний этаж? Добавьте 10% по BTU</li>
        <li>Для чего: только охлаждение или и отопление?</li>
        <li>Спальня? Ищите шум ниже 25 дБ</li>
        <li>Определите бюджет на технику + монтаж (на монтаже не экономьте)</li>
        <li>Проверьте, есть ли у бренда авторизованный сервис в Болгарии</li>
        <li>Спросите про антикоррозийное покрытие — для Варны обязательно</li>
      </ul>
      <p>
        Готовы выбирать? Начните с нашего{" "}
        <a href="/" className="text-primary underline underline-offset-4 hover:text-primary/80">
          AI-консультанта
        </a>{" "}
        — он поможет подобрать модель под вашу комнату и бюджет.
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
      <h2>Чому вибір кондиціонера у Варні — це інша історія</h2>
      <p>
        Варна — не Київ, не Одеса і навіть не Софія. Приморський клімат ставить
        специфічні вимоги до кліматичної техніки, які більшість покупців ігнорує.
        Не врахуєте — переплатите за електрику, швидше підете в ремонт і будете
        розчаровані.
      </p>

      <h3>Вологість 60-80% все літо</h3>
      <p>
        Морський бриз несе вологу. Літня вологість у Варні тримається на
        60-80%, тоді як у Софії рідко перевищує 50%. Кондиціонер працює
        подвійно — і охолоджує, і осушує повітря. Це додаткове навантаження
        на компресор і підвищене споживання при недостатній потужності. Для
        Варни завжди закладайте запас — мінімум 10% понад стандартні розрахунки.
      </p>

      <h3>Солоне повітря — ворог зовнішнього блоку</h3>
      <p>
        В радіусі 2-3 км від моря сіль у повітрі прискорює корозію
        конденсатора. Кондиціонер без антикорозійного покриття (Golden Fin,
        Blue Fin) починає іржавіти через 2-3 роки. Ламелі руйнуються,
        ефективність падає, ремонт коштує дорого. Живете в приморських
        районах — Чайка, Бриз, Аспарухово, Галата? Антикорозійний захист —
        не розкіш, а необхідність.
      </p>

      <h3>М&#39;які зими — кондиціонер як основне опалення</h3>
      <p>
        Середня температура січня +2...+3°C. Днів нижче -5°C за всю зиму
        набирається три-чотири. Для тих, хто переїхав з України, це здається
        неймовірним — але саме це робить інверторний кондиціонер ідеальним для
        цілорічного опалення. У Києві це ризиковано. У Варні — стандартна практика.
      </p>

      <h3>Панельні будинки — знайома тема</h3>
      <p>
        Більшість житла у Варні — панельки, дуже схожі на наші. Без зовнішнього
        утеплення тепловтрати на 30-40% вищі за норму. Якщо будинок не утеплений,
        додавайте 20-30% до рекомендованих BTU. Старі дерев&#39;яні вікна? Подумайте
        про ущільнення перед покупкою кондиціонера.
      </p>

      <h2>Калькулятор BTU — скільки потужності потрібно</h2>
      <p>
        BTU (British Thermal Unit) — одиниця потужності кондиціонера. Більше
        BTU = більшу площу обслуговує. Але &quot;чим більше, тим краще&quot; тут не
        працює — завеликий кондиціонер тактує (вмикається-вимикається), втрачає
        ефективність і шумить більше.
      </p>

      <h3>Базове правило: 340 BTU на квадратний метр</h3>
      <p>
        Для стандартного приміщення зі стелями 2.60 м, середньою ізоляцією та
        одним південним вікном: площа x 340 = мінімальні BTU. Кімната 20 м² =
        6800 BTU, округлюємо вгору до стандартних 9000.
      </p>

      <h3>Поправочні коефіцієнти</h3>
      <ul>
        <li><strong>Південна сторона:</strong> +15% — пряме сонце додає теплове навантаження</li>
        <li><strong>Останній поверх:</strong> +10% — дах передає додаткове тепло</li>
        <li><strong>Погана ізоляція / стара панелька:</strong> +20% — тепло йде через стіни</li>
        <li><strong>Кухня / багато техніки:</strong> +10% — плита, духовка та холодильник виділяють тепло</li>
        <li><strong>Приморська вологість (Варна):</strong> +10% — додаткова робота на осушення</li>
      </ul>

      <h3>Таблиця: площа та рекомендовані BTU</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Площа</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Рекоменд. BTU</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">Типова модель</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">до 15 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">9 000</td>
              <td className="text-center px-4 py-3 border border-border/60">дев&#39;ятка</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">15-20 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">9 000 – 12 000</td>
              <td className="text-center px-4 py-3 border border-border/60">9-ка або 12-ка</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">20-25 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">12 000</td>
              <td className="text-center px-4 py-3 border border-border/60">дванадцятка</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">25-35 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">12 000 – 18 000</td>
              <td className="text-center px-4 py-3 border border-border/60">12-ка або 18-ка</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">35-45 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">18 000</td>
              <td className="text-center px-4 py-3 border border-border/60">вісімнадцятка</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">45-60 м²</td>
              <td className="text-center px-4 py-3 border border-border/60">24 000</td>
              <td className="text-center px-4 py-3 border border-border/60">двадцять четвірка</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Не впевнені, скільки BTU потрібно? Наш{" "}
        <a href="/" className="text-primary underline underline-offset-4 hover:text-primary/80">
          AI-консультант
        </a>{" "}
        розрахує точно — скажіть йому площу, поверх та сторону світу.
      </p>

      <h2>Інвертор чи звичайний — що обрати</h2>
      <p>
        Тут дискусії немає, але пояснимо чому. Інверторний компресор плавно
        регулює оберти — як педаль газу в авто. Звичайний (on/off) працює лише
        на повну: увімкнувся, охолодив/нагрів, вимкнувся, зачекав поки
        температура відхилилась, знову на повну.
      </p>

      <h3>Інверторний кондиціонер</h3>
      <ul>
        <li><strong>На 30-50% менше електрики</strong> — компресор працює на мінімальних обертах більшу частину часу</li>
        <li><strong>Стабільна температура</strong> — без стрибків на 2-3 градуси</li>
        <li><strong>Тихіший</strong> — на низьких обертах шум мінімальний</li>
        <li><strong>Довше служить</strong> — без постійних пусків, що зношують компресор</li>
        <li><strong>Ефективне опалення</strong> — працює при -15°C і навіть -25°C</li>
      </ul>

      <h3>Звичайний (неінверторний) кондиціонер</h3>
      <ul>
        <li>Дешевший при купівлі — різниця 300-500 лв (150-250 євро)</li>
        <li>Дорожчий в експлуатації — на 30-50% більше електрики</li>
        <li>Гучний — компресор тільки на максимумі</li>
        <li>Не підходить для опалення — при низьких температурах просто вимикається</li>
      </ul>
      <p>
        <strong>Вердикт для Варни:</strong> тільки інвертор. Якщо будете
        використовувати кондиціонер для опалення (а це найдешевший спосіб
        у Болгарії), інвертор обов&#39;язковий. Різниця в ціні відбивається
        за 1-2 опалювальних сезони.
      </p>

      <h2>Енергокласи — що означають SEER та SCOP</h2>
      <p>
        Етикетки A+, A++, A+++ — не маркетинг. За ними стоять конкретні
        цифри, які напряму впливають на рахунок за електрику.
      </p>
      <ul>
        <li><strong>SEER</strong> (Seasonal Energy Efficiency Ratio) — ефективність охолодження. Вище = дешевше літо.</li>
        <li><strong>SCOP</strong> (Seasonal Coefficient of Performance) — ефективність опалення. Вище = дешевша зима.</li>
      </ul>

      <h3>Що показують цифри</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Клас</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">SEER</th>
              <th className="text-center px-4 py-3 font-semibold border border-border/60">SCOP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold text-green-700">A+++</td>
              <td className="text-center px-4 py-3 border border-border/60">&gt; 8.5</td>
              <td className="text-center px-4 py-3 border border-border/60">&gt; 5.1</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-semibold">A++</td>
              <td className="text-center px-4 py-3 border border-border/60">6.1 – 8.5</td>
              <td className="text-center px-4 py-3 border border-border/60">4.6 – 5.1</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">A+</td>
              <td className="text-center px-4 py-3 border border-border/60">5.6 – 6.1</td>
              <td className="text-center px-4 py-3 border border-border/60">4.0 – 4.6</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60 font-semibold">A</td>
              <td className="text-center px-4 py-3 border border-border/60">5.1 – 5.6</td>
              <td className="text-center px-4 py-3 border border-border/60">3.4 – 4.0</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Конкретний приклад: кондиціонер A+++ проти A+ при 8 місяцях використання
        економить близько <strong>200 лв на рік</strong> на електриці (приблизно
        2900 грн). За 10 років — 2000 лв. Різниця в ціні між A+ та A+++ моделлю
        рідко перевищує 500-800 лв.
      </p>
      <p>
        <strong>Для Варни:</strong> якщо опалюєте кондиціонером (а це найвигідніший
        спосіб у Болгарії), SCOP важливіший за SEER. Зима — 5 місяців роботи,
        літо — 3. При виборі дивіться на SCOP насамперед.
      </p>

      <h2>Рівень шуму — що означають цифри</h2>
      <p>
        Виробники вказують шум у децибелах (дБ). Ось що вони означають на
        практиці:
      </p>
      <ul>
        <li><strong>&lt; 22 дБ</strong> — шепіт. Ідеально для спальні. Кондиціонера не почуєте навіть вночі.</li>
        <li><strong>22-28 дБ</strong> — тиха розмова. Підходить для вітальні та кабінету.</li>
        <li><strong>28-35 дБ</strong> — звичайна кімната. Легкий фон, не дратує.</li>
        <li><strong>&gt; 35 дБ</strong> — помітний шум. Для спальні — забагато.</li>
      </ul>
      <p>
        Ці цифри — для <strong>внутрішнього блоку на мінімальних обертах</strong>.
        На максимальних додайте 5-10 дБ. Завжди перевіряйте обидва значення.
      </p>
      <p>
        <strong>Важливо для квартир у Болгарії:</strong> не забувайте про шум
        зовнішнього блоку. В панельному будинку гучний зовнішній блок (понад
        55 дБ) дратуватиме сусідів. Преміальні моделі Daikin та Mitsubishi —
        46-50 дБ зовні.
      </p>

      <h2>Які бренди продаються в Болгарії</h2>
      <p>
        Не кожен бренд має авторизований сервіс у країні. Без сервісу гарантія —
        папірець. Якщо щось зламається — оригінальних запчастин немає, лагодити
        нікому.
      </p>

      <h3>Преміум-сегмент</h3>
      <p>
        <strong>Daikin</strong> та <strong>Mitsubishi Electric</strong> —
        японська якість, найтихіші компресори, високий SCOP, антикорозійне
        покриття в стандарті. Ціна: від 2200 лв за дванадцятку з монтажем
        (~1100 євро, ~32000 грн). Відмінна сервісна мережа по всій Болгарії.
      </p>

      <h3>Середній сегмент</h3>
      <p>
        <strong>Toshiba</strong> та <strong>Gree</strong> — чудове співвідношення
        ціна/якість. Gree — найбільший виробник кондиціонерів у світі. Toshiba —
        японська надійність за доступною ціною. Від 1500 лв за дванадцятку з
        монтажем (~750 євро, ~22000 грн). Гарна сервісна мережа.
      </p>

      <h3>Бюджетний сегмент</h3>
      <p>
        <strong>AUX</strong>, <strong>Midea</strong>, <strong>TechPoint</strong> —
        пристойна якість за свої гроші. AUX виробляється на заводах Midea
        (другий за величиною виробник у світі). Від 1100 лв за дванадцятку з
        монтажем (~550 євро, ~16000 грн). Сервіс є, але мережа скромніша.
      </p>
      <p>
        <strong>Правило:</strong> купуйте тільки бренди з авторизованим сервісом
        у Болгарії. &quot;Ноунейм&quot; з інтернету може здаватися вигідним, але при
        поломці компресора заплатите як за новий кондиціонер.
      </p>
      <p>
        Дивіться{" "}
        <a href="/catalog" className="text-primary underline underline-offset-4 hover:text-primary/80">
          актуальні ціни та наявність у каталозі
        </a>.
      </p>

      <h2>Монтаж важливіший за бренд</h2>
      <p>
        Можна купити найдорожчий Daikin, але якщо монтаж зроблений абияк —
        проблеми гарантовані. Поганий монтаж — причина номер один рекламацій
        та незадоволення.
      </p>

      <h3>Що може піти не так</h3>
      <ul>
        <li><strong>Без вакуумування:</strong> волога в системі руйнує компресор зсередини. Гарантія анулюється.</li>
        <li><strong>Погана ізоляція труб:</strong> конденсат, капає, втрата ефективності до 15%.</li>
        <li><strong>Неправильний ухил дренажу:</strong> вода повертається і капає з внутрішнього блоку.</li>
        <li><strong>Коротка траса без запасу:</strong> вібрації, шум, напруга в з&#39;єднаннях.</li>
        <li><strong>Загини труб під гострим кутом:</strong> порушує циркуляцію фреону.</li>
      </ul>

      <h3>Що вимагати від монтажника</h3>
      <ul>
        <li>Вакуумування мінімум 15-20 хвилин з манометром</li>
        <li>Ізоляція UV-стійкою піною по всій довжині траси</li>
        <li>Правильний ухил дренажу (мінімум 1 см на метр)</li>
        <li>Надійний кронштейн для зовнішнього блоку з антивібраційними подушками</li>
        <li>Перевірка герметичності після монтажу</li>
      </ul>
      <p>
        Наш монтаж — <strong>своя бригада, не субпідрядники</strong>. Ми знаємо,
        хто монтує, і несемо відповідальність. 12 місяців гарантії на роботу,
        плюс повна заводська гарантія на обладнання.
      </p>

      <h2>Чек-лист перед покупкою</h2>
      <ul>
        <li>Виміряйте кімнату в квадратних метрах (довжина x ширина)</li>
        <li>Запишіть орієнтацію — південь = більше сонця = більше BTU</li>
        <li>Останній поверх? Додайте 10% по BTU</li>
        <li>Для чого: тільки охолодження чи й опалення?</li>
        <li>Спальня? Шукайте шум нижче 25 дБ</li>
        <li>Визначте бюджет на техніку + монтаж (на монтажі не економте)</li>
        <li>Перевірте, чи є у бренда авторизований сервіс у Болгарії</li>
        <li>Запитайте про антикорозійне покриття — для Варни обов&#39;язково</li>
      </ul>
      <p>
        Готові обирати? Почніть з нашого{" "}
        <a href="/" className="text-primary underline underline-offset-4 hover:text-primary/80">
          AI-консультанта
        </a>{" "}
        — він допоможе підібрати модель під вашу кімнату та бюджет.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Post definition                                                    */
/* ------------------------------------------------------------------ */
export const howToChooseAc: BlogPost = {
  slug: "how-to-choose-ac",
  date: "2026-04-22",
  image: "/images/blog/how-to-choose-ac.jpg",
  readingTime: {
    bg: "15 мин",
    en: "15 min",
    ru: "15 мин",
    ua: "15 хв",
  },
  title: {
    bg: "Как да изберем климатик — пълен наръчник за Варна и крайморските градове",
    en: "How to Choose an AC — Complete Guide for Varna and Coastal Cities",
    ru: "Как выбрать кондиционер — полный гид для Варны и приморских городов",
    ua: "Як обрати кондиціонер — повний гід для Варни та приморських міст",
  },
  excerpt: {
    bg: "BTU калкулатор, инвертор срещу неинвертор, енергийни класове, нива на шум и марки с оторизиран сервиз в България. Всичко, което трябва да знаете преди да купите климатик за Варна.",
    en: "BTU calculator, inverter vs non-inverter, energy classes, noise levels, and brands with authorized service in Bulgaria. Everything you need to know before buying an AC in Varna.",
    ru: "Калькулятор BTU, инвертор или обычный, энергоклассы, уровень шума и бренды с авторизованным сервисом в Болгарии. Всё, что нужно знать перед покупкой кондиционера в Варне.",
    ua: "Калькулятор BTU, інвертор чи звичайний, енергокласи, рівень шуму та бренди з авторизованим сервісом у Болгарії. Все, що потрібно знати перед покупкою кондиціонера у Варні.",
  },
  keywords: {
    bg: ["как да изберем климатик", "климатик варна", "BTU калкулатор", "инверторен климатик", "монтаж климатик Варна"],
    en: ["how to choose AC", "air conditioner Varna", "BTU calculator", "inverter AC Bulgaria", "AC installation Varna"],
    ru: ["как выбрать кондиционер", "кондиционер для квартиры болгария", "кондиционер варна", "BTU калькулятор", "монтаж кондиционера Варна"],
    ua: ["як обрати кондиціонер", "кондиціонер для квартири болгарія", "кондиціонер варна", "BTU калькулятор", "монтаж кондиціонера Варна"],
  },
  content: {
    bg: ContentBG,
    en: ContentEN,
    ru: ContentRU,
    ua: ContentUA,
  },
  faq: {
    bg: [
      { question: "Колко BTU са нужни за стая 20 кв.м?", answer: "За стая 20 кв.м са нужни 9000-12000 BTU в зависимост от изложението, етажа и изолацията. За южно изложение и последен етаж — 12000 BTU. За добре изолирана стая на среден етаж — 9000 BTU е достатъчно." },
      { question: "Струва ли си инверторният климатик?", answer: "Да. Инверторът харчи 30-50% по-малко ток и разликата в цената (300-500 лв) се изплаща за 1-2 отоплителни сезона. Освен това е по-тих и поддържа стабилна температура." },
      { question: "Мога ли да отоплявам апартамента само с климатик?", answer: "Във Варна — да. Средната зимна температура е +2...+3°C, а дни под -5°C са три-четири за цяла зима. Инверторният климатик покрива 100% от нуждите за отопление при варненския климат." },
      { question: "Коя марка климатик е най-добра?", answer: "Зависи от бюджета. Daikin и Mitsubishi са премиум — най-тихи, най-ефективни, но и най-скъпи. Gree и Toshiba предлагат отлично качество на по-достъпна цена. AUX и Midea са добър бюджетен вариант. Важно: купувайте само марки с оторизиран сервиз в България." },
      { question: "Колко струва монтажът на климатик?", answer: "Стандартният монтаж (до 3 м тръбопровод) започва от 300 лв. Цената зависи от етажа, дължината на тръбопровода и сложността на монтажа. Не пестете от монтажа — лошият монтаж анулира гаранцията и увеличава сметката за ток." },
    ],
    en: [
      { question: "How many BTU do I need for a 20 m² room?", answer: "A 20 m² room needs 9,000-12,000 BTU depending on sun exposure, floor level, and insulation. South-facing top floor — go with 12,000. Well-insulated mid-floor room — 9,000 BTU is enough." },
      { question: "Is an inverter AC worth the extra cost?", answer: "Yes. Inverter units use 30-50% less electricity and the price difference (150-250 EUR) pays for itself in 1-2 heating seasons. They are also quieter and maintain more stable temperatures." },
      { question: "Can I heat my apartment with just an AC?", answer: "In Varna — absolutely. Average winter temperature is +2...+3°C, with only 3-4 days below -5°C per winter. An inverter AC covers 100% of heating needs in Varna's mild coastal climate." },
      { question: "Which AC brand is best?", answer: "Depends on budget. Daikin and Mitsubishi Electric are premium — quietest, most efficient, but priciest. Gree and Toshiba offer excellent quality at mid-range prices. AUX and Midea are solid budget options. Key rule: only buy brands with authorized service in Bulgaria." },
      { question: "How much does AC installation cost?", answer: "Standard installation (up to 3 m piping) starts from 300 BGN (~150 EUR). Price depends on floor level, pipe length, and complexity. Never skimp on installation — poor work voids warranty and increases electricity bills." },
    ],
    ru: [
      { question: "Сколько BTU нужно для комнаты 20 м²?", answer: "Для комнаты 20 м² нужно 9000-12000 BTU в зависимости от стороны света, этажа и теплоизоляции. Южная сторона, последний этаж — берите 12000. Хорошо утепленная комната на среднем этаже — хватит 9000 BTU." },
      { question: "Стоит ли переплачивать за инвертор?", answer: "Да. Инвертор потребляет на 30-50% меньше электричества, а разница в цене (300-500 лв, ~150-250 евро) отбивается за 1-2 отопительных сезона. Плюс тише работает и держит стабильную температуру." },
      { question: "Можно ли отапливать квартиру только кондиционером?", answer: "В Варне — да. Средняя зимняя температура +2...+3°C, дней ниже -5°C за всю зиму набирается три-четыре. Инверторный кондиционер полностью покрывает потребности в отоплении при варненском климате." },
      { question: "Какой бренд кондиционера лучше?", answer: "Зависит от бюджета. Daikin и Mitsubishi — премиум: самые тихие, самые эффективные, но и самые дорогие. Gree и Toshiba — отличное качество по средней цене. AUX и Midea — хороший бюджетный вариант. Главное: покупайте только бренды с авторизованным сервисом в Болгарии." },
      { question: "Сколько стоит монтаж кондиционера?", answer: "Стандартный монтаж (до 3 м трассы) — от 300 лв (~150 евро). Цена зависит от этажа, длины трассы и сложности. Не экономьте на монтаже — плохая установка аннулирует гарантию и увеличивает счет за электричество." },
    ],
    ua: [
      { question: "Скільки BTU потрібно для кімнати 20 м²?", answer: "Для кімнати 20 м² потрібно 9000-12000 BTU залежно від сторони світу, поверху та теплоізоляції. Південна сторона, останній поверх — беріть 12000. Добре утеплена кімната на середньому поверсі — вистачить 9000 BTU." },
      { question: "Чи варто переплачувати за інвертор?", answer: "Так. Інвертор споживає на 30-50% менше електрики, а різниця в ціні (300-500 лв, ~150-250 євро) відбивається за 1-2 опалювальних сезони. До того ж тихіший і тримає стабільну температуру." },
      { question: "Чи можна опалювати квартиру тільки кондиціонером?", answer: "У Варні — так. Середня зимова температура +2...+3°C, днів нижче -5°C за всю зиму набирається три-чотири. Інверторний кондиціонер повністю покриває потреби в опаленні при варненському кліматі." },
      { question: "Який бренд кондиціонера найкращий?", answer: "Залежить від бюджету. Daikin та Mitsubishi — преміум: найтихіші, найефективніші, але й найдорожчі. Gree та Toshiba — відмінна якість за середню ціну. AUX та Midea — хороший бюджетний варіант. Головне: купуйте тільки бренди з авторизованим сервісом у Болгарії." },
      { question: "Скільки коштує монтаж кондиціонера?", answer: "Стандартний монтаж (до 3 м траси) — від 300 лв (~150 євро, ~4400 грн). Ціна залежить від поверху, довжини траси та складності. Не економте на монтажі — поганий монтаж анулює гарантію і збільшує рахунок за електрику." },
    ],
  },
};
