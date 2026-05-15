import type { BlogPost } from "../types";

/* ------------------------------------------------------------------ */
/*  BG content                                                         */
/* ------------------------------------------------------------------ */
function ContentBG() {
  return (
    <>
      <h2>Кратък отговор: колко плащате реално?</h2>
      <p>
        За типичен апартамент във Варна с инверторен климатик 12000 BTU клас
        А++, разходът за ток през летен месец е <strong>50-110 лв</strong>. Ако
        ползвате уреда 6-8 часа на ден на правилни настройки (25-26°C), сметката
        ще е към долната граница. Ако държите 22°C денонощно — към горната, и
        дори отгоре.
      </p>
      <p>
        В тази статия даваме конкретни числа за всеки тип уред: 9000, 12000,
        18000, 24000 BTU. Показваме реална формула, тарифите за Варна и 8
        начина да отрежете сметката с до 40% без да жертвате комфорт.
      </p>

      <h2>Формулата за пресмятане</h2>
      <p>
        Разходът се изчислява по простата формула:
      </p>
      <p>
        <strong>Разход (лв) = Мощност (kW) × Часове × Цена (лв/kWh) ÷ SEER коефициент</strong>
      </p>
      <p>
        Където:
      </p>
      <ul>
        <li><strong>Мощност в kW</strong> — за климатик 12000 BTU охладителната мощност е ~3.5 kW, но реално консумираната електрическа мощност е значително по-малка благодарение на SEER коефициента.</li>
        <li><strong>SEER (Seasonal Energy Efficiency Ratio)</strong> — колко &quot;охлаждане&quot; получавате за всеки kW консумиран ток. Модерен А++ инвертор има SEER 6.5-8.5. Това значи, че за 3.5 kW охлаждане реално харчите 0.4-0.55 kW електричество.</li>
        <li><strong>Цена на тока</strong> — във Варна за битови клиенти е ~0.22-0.30 лв/kWh дневна тарифа, ~0.13-0.18 лв/kWh нощна (свободен пазар след 2025 г. — реалните цени зависят от вашия доставчик).</li>
      </ul>

      <h2>Таблица: разход в BGN по тип уред</h2>
      <p>
        Реален месечен разход при дневна тарифа ~0.27 лв/kWh, нормална употреба
        и инверторен модел А++. Числата са за чист &quot;ток за климатика&quot;,
        не за цялата сметка.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">BTU</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">За площ</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">4 ч/ден</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">8 ч/ден</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">12 ч/ден</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">9 000</td>
              <td className="px-4 py-3 border border-border/60">до 20 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~25 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~50 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~75 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">12 000</td>
              <td className="px-4 py-3 border border-border/60">20-30 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~35 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~70 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~105 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">18 000</td>
              <td className="px-4 py-3 border border-border/60">30-45 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~55 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~110 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~165 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">24 000</td>
              <td className="px-4 py-3 border border-border/60">45-60 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~75 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~150 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~225 лв</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        <em>Бележка:</em> при работа в Sleep mode през нощта с нощна тарифа
        реалните числа са с 30-40% по-ниски. Числата по-горе са за дневна
        тарифа.
      </p>

      <h2>Защо SEER е по-важен от BTU при сметката</h2>
      <p>
        Двата климатика с еднаква мощност 12000 BTU могат да имат разлика в
        разхода <strong>до 2 пъти</strong>. Защо? Защото SEER коефициентът
        показва ефективността.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Енергиен клас</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">SEER</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Разход за 8ч/ден (12k BTU)</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">За сезон (3 месеца)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">A (стар)</td>
              <td className="px-4 py-3 border border-border/60">3.2</td>
              <td className="px-4 py-3 border border-border/60 text-right">~130 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~390 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">A+</td>
              <td className="px-4 py-3 border border-border/60">5.6</td>
              <td className="px-4 py-3 border border-border/60 text-right">~85 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~255 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">A++</td>
              <td className="px-4 py-3 border border-border/60">7.0</td>
              <td className="px-4 py-3 border border-border/60 text-right">~70 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~210 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">A+++</td>
              <td className="px-4 py-3 border border-border/60">8.5+</td>
              <td className="px-4 py-3 border border-border/60 text-right">~55 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~165 лв</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Разликата A vs A+++ е <strong>225 лв на сезон само за един уред</strong>.
        Ако сте на летен режим 3 месеца + зимен Heat режим още 4 месеца,
        разликата е 400-600 лв годишно. Затова разликата в цената на покупка
        (200-400 лв) се изплаща за 1-2 години.
      </p>

      <h2>Реален пример: апартамент в Чайка, 70 m²</h2>
      <p>
        Двустаен апартамент на 5-ти етаж в Чайка, южно изложение. Един климатик
        Daikin 12000 BTU клас А++ в дневната. Семейство от 3 души, лятна
        употреба:
      </p>
      <ul>
        <li>Сутрин 7:00-9:00 (2 часа) преди работа: Cool 25°C</li>
        <li>Прибиране 18:00-22:00 (4 часа): Cool 25°C + Sleep последния час</li>
        <li>Нощта 22:00-7:00 (Sleep mode на 26°C): ~9 часа в икономичен режим</li>
      </ul>
      <p>
        Общо ~12 часа реална работа дневно, но 9 от тях са в Sleep mode (~50%
        мощност). Ефективният &quot;пълен&quot; час е ~7.5 часа.
      </p>
      <p>
        Резултат: <strong>~65-80 лв/месец</strong> чист разход за климатика. За
        тримесечен сезон юни-август — около 200-240 лв. Без климатик в горещ
        панелен блок Чайка през август — не вариант.
      </p>

      <h2>Лято vs Зима — кога харчи повече</h2>
      <p>
        Изненадващо, повечето варненски климатици <strong>харчат повече
        през лятото</strong>, не зимата. Причината:
      </p>
      <ul>
        <li><strong>Лято:</strong> жегата е 30-36°C, разлика с целта (25°C) — 5-11°C. Уредът работи дълго.</li>
        <li><strong>Зима:</strong> рядко е под 0°C, обикновено 5-10°C. Разлика с целта (21°C) — 11-16°C. По-голяма разлика, но Heat режимът на термопомпа е по-ефективен (COP 3.5-4.5 vs SEER 7+ при много варненски лета зимата всъщност е по-евтина при подобни часове).</li>
      </ul>
      <p>
        Реалното правило: <strong>в умерените месеци (май, септември, октомври)
        климатикът е драматично по-евтин</strong> — работи кратко и в режим
        Dry. През тези месеци разходът пада до 15-30 лв/месец.
      </p>

      <h2>Тарифи за ток във Варна (2026)</h2>
      <p>
        Варна е в обхвата на &quot;Електроразпределение Север&quot; (ЕРП Север,
        преди ЕнергоПро). От юли 2025 г. битовите клиенти могат да изберат
        свободен пазар. Ориентировъчни цени:
      </p>
      <ul>
        <li><strong>Дневна тарифа</strong> (06:00-22:00 за двутарифни брояци): ~0.22-0.30 лв/kWh.</li>
        <li><strong>Нощна тарифа</strong> (22:00-06:00): ~0.13-0.18 лв/kWh.</li>
        <li><strong>Единна тарифа</strong> (за стандартни брояци): ~0.22-0.26 лв/kWh.</li>
      </ul>
      <p>
        Реалните цени варират според вашия доставчик и план. Препоръчваме да
        проверите фактурата си — данните за реалната цена на kWh са на гърба.
        Ако имате двутарифен брояч и ползвате климатика основно нощем (Sleep
        mode), реалният разход е с ~30% по-нисък от таблиците.
      </p>

      <h2>8 начина да отрежете сметката с до 40%</h2>
      <ol>
        <li><strong>Сложете температурата на 25-26°C</strong> вместо 22°C. Само това спестява 30-40%.</li>
        <li><strong>Активирайте Sleep mode</strong> за нощта. Уредът сам ще оптимизира.</li>
        <li><strong>Профилактика веднъж годишно.</strong> Запушен филтър = -25% ефективност = -25% от парите ви.</li>
        <li><strong>Ползвайте Dry mode</strong> в умерените дни вместо Cool. 50% по-нисък разход.</li>
        <li><strong>Затваряйте щори и завеси</strong> на южните прозорци през деня. Намалявате топлинния товар.</li>
        <li><strong>Ползвайте нощна тарифа</strong> — нощно охлаждане до 22°C, после Sleep, после изключване на сутринта.</li>
        <li><strong>Не пускайте уреда в празна стая</strong> &quot;за всеки случай&quot;. Климатикът не &quot;пази&quot; температурата — той реагира на потребност.</li>
        <li><strong>Сменете старите уреди А-клас с А++ инвертор.</strong> Изплаща се за 1-2 сезона.</li>
      </ol>

      <h2>Инвертор vs неинвертор — реална годишна разлика</h2>
      <p>
        Неинверторният климатик работи на принципа &quot;вкл/изкл&quot; — щом
        достигне температурата, изключва компресора. После температурата се
        качва, той пак стартира. Всеки старт изразходва голямо количество
        електричество (като &quot;стартов ток&quot; на електромотор).
      </p>
      <p>
        Инверторният регулира честотата на компресора — работи на по-ниска
        мощност постоянно. Спестяване: <strong>30-40% годишно</strong>.
      </p>
      <p>
        За типичен апартамент в Варна, целогодишна разлика инвертор vs
        неинвертор:
      </p>
      <ul>
        <li>Неинвертор A: ~650-800 лв/година за един уред</li>
        <li>Инвертор A++: ~380-480 лв/година</li>
        <li><strong>Икономия: ~270-320 лв/година</strong></li>
      </ul>
      <p>
        За 7-10 години живот на уреда — 2000-3000 лв спестявания. Това е
        повече от стойността на самия климатик.
      </p>

      <h2>Какво да направите сега</h2>
      <p>
        Първо: <strong>намалете температурата от текущата на 25-26°C</strong>
        и пуснете Sleep mode за нощта. Това е безплатна икономия от 30-40%
        още този месец.
      </p>
      <p>
        Второ: ако климатикът ви е А-клас (купен преди 2018 г.) — пресметнете
        дали си струва да го смените. Често разликата се изплаща за 2-3
        сезона. Може да попитате нашия AI-консултант на сайта за конкретна
        препоръка според вашата ситуация.
      </p>
      <p>
        Трето: ако не сте правили профилактика тази година — направете я. 25%
        ефективност на нищото не може да се сравни с никаква настройка.
        Заявете чрез формата на сайта или позвънете.
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
      <h2>Short answer: what do you actually pay?</h2>
      <p>
        For a typical Varna apartment with a 12000 BTU A++ inverter AC, the
        electricity cost for a summer month is <strong>50-110 BGN</strong>
        (~25-55 EUR). If you run it 6-8 hours a day at correct settings
        (25-26°C), the bill is at the lower end. If you hold 22°C around the
        clock — at the top, and beyond.
      </p>
      <p>
        This article gives concrete numbers for every unit type: 9 000, 12 000,
        18 000, 24 000 BTU. We show the real formula, Varna tariffs, and 8 ways
        to cut up to 40% off the bill without sacrificing comfort.
      </p>

      <h2>The calculation formula</h2>
      <p>
        Consumption is computed by a simple formula:
      </p>
      <p>
        <strong>Cost (BGN) = Power (kW) × Hours × Price (BGN/kWh) ÷ SEER</strong>
      </p>
      <p>Where:</p>
      <ul>
        <li><strong>Power in kW</strong> — for a 12000 BTU unit cooling capacity is ~3.5 kW, but actual electrical consumption is significantly less due to SEER.</li>
        <li><strong>SEER (Seasonal Energy Efficiency Ratio)</strong> — how much &quot;cooling&quot; you get per kW of electricity consumed. A modern A++ inverter has SEER 6.5-8.5. That means for 3.5 kW of cooling you actually spend 0.4-0.55 kW of electricity.</li>
        <li><strong>Electricity price</strong> — in Varna for household clients ~0.22-0.30 BGN/kWh day rate, ~0.13-0.18 BGN/kWh night rate (free market since 2025 — actual prices depend on your supplier).</li>
      </ul>

      <h2>Table: cost in BGN by unit type</h2>
      <p>
        Real monthly cost at ~0.27 BGN/kWh day rate, normal usage, A++ inverter.
        Numbers are pure &quot;AC electricity&quot;, not the whole bill.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">BTU</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">For area</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">4h/day</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">8h/day</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">12h/day</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">9 000</td>
              <td className="px-4 py-3 border border-border/60">up to 20 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~25 BGN</td>
              <td className="px-4 py-3 border border-border/60 text-right">~50 BGN</td>
              <td className="px-4 py-3 border border-border/60 text-right">~75 BGN</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">12 000</td>
              <td className="px-4 py-3 border border-border/60">20-30 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~35 BGN</td>
              <td className="px-4 py-3 border border-border/60 text-right">~70 BGN</td>
              <td className="px-4 py-3 border border-border/60 text-right">~105 BGN</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">18 000</td>
              <td className="px-4 py-3 border border-border/60">30-45 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~55 BGN</td>
              <td className="px-4 py-3 border border-border/60 text-right">~110 BGN</td>
              <td className="px-4 py-3 border border-border/60 text-right">~165 BGN</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">24 000</td>
              <td className="px-4 py-3 border border-border/60">45-60 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~75 BGN</td>
              <td className="px-4 py-3 border border-border/60 text-right">~150 BGN</td>
              <td className="px-4 py-3 border border-border/60 text-right">~225 BGN</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        <em>Note:</em> running Sleep mode at night on a night-rate meter brings
        real numbers down by 30-40%. Numbers above assume day rate.
      </p>

      <h2>Why SEER matters more than BTU for the bill</h2>
      <p>
        Two ACs with the same 12000 BTU rating can have a <strong>2x difference
        in consumption</strong>. Why? Because SEER measures efficiency.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Energy class</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">SEER</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Cost at 8h/day (12k BTU)</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Per season (3 months)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">A (old)</td>
              <td className="px-4 py-3 border border-border/60">3.2</td>
              <td className="px-4 py-3 border border-border/60 text-right">~130 BGN</td>
              <td className="px-4 py-3 border border-border/60 text-right">~390 BGN</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">A+</td>
              <td className="px-4 py-3 border border-border/60">5.6</td>
              <td className="px-4 py-3 border border-border/60 text-right">~85 BGN</td>
              <td className="px-4 py-3 border border-border/60 text-right">~255 BGN</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">A++</td>
              <td className="px-4 py-3 border border-border/60">7.0</td>
              <td className="px-4 py-3 border border-border/60 text-right">~70 BGN</td>
              <td className="px-4 py-3 border border-border/60 text-right">~210 BGN</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">A+++</td>
              <td className="px-4 py-3 border border-border/60">8.5+</td>
              <td className="px-4 py-3 border border-border/60 text-right">~55 BGN</td>
              <td className="px-4 py-3 border border-border/60 text-right">~165 BGN</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Difference A vs A+++ is <strong>225 BGN per season for a single
        unit</strong>. If you run summer Cool 3 months + winter Heat for 4
        more months, the difference is 400-600 BGN per year. So the price
        premium (200-400 BGN) pays off in 1-2 years.
      </p>

      <h2>Real example: apartment in Chayka, 70 m²</h2>
      <p>
        Two-room apartment on the 5th floor in Chayka, south-facing. One Daikin
        12000 BTU A++ AC in the living room. Family of 3, summer use:
      </p>
      <ul>
        <li>Morning 07:00-09:00 (2h) before work: Cool 25°C</li>
        <li>Evening 18:00-22:00 (4h): Cool 25°C + Sleep last hour</li>
        <li>Night 22:00-07:00 (Sleep mode at 26°C): ~9h in economy mode</li>
      </ul>
      <p>
        Total ~12h real runtime daily, 9 of them in Sleep (~50% power). Effective
        &quot;full&quot; hours: ~7.5.
      </p>
      <p>
        Result: <strong>~65-80 BGN/month</strong> pure AC consumption. For a 3-
        month June-August season — about 200-240 BGN. Without AC in a hot
        Chayka concrete block in August — not an option.
      </p>

      <h2>Summer vs Winter — which costs more</h2>
      <p>
        Surprisingly, most Varna ACs <strong>cost more in summer</strong>, not
        winter. Reason:
      </p>
      <ul>
        <li><strong>Summer:</strong> heat is 30-36°C, gap with target (25°C) = 5-11°C. Long runtime.</li>
        <li><strong>Winter:</strong> rarely below 0°C, usually 5-10°C. Gap with target (21°C) = 11-16°C. Bigger gap, but Heat mode on a heat pump is more efficient (COP 3.5-4.5). With Varna&apos;s mild winters, at similar hours winter actually ends up cheaper.</li>
      </ul>
      <p>
        Real rule: <strong>in mild months (May, September, October) AC is
        dramatically cheaper</strong> — runs briefly and in Dry mode. Cost drops
        to 15-30 BGN/month.
      </p>

      <h2>Electricity tariffs in Varna (2026)</h2>
      <p>
        Varna falls under &quot;Elektrorazpredelenie Sever&quot; (formerly
        EnergoPro). Since July 2025 household clients can choose the free
        market. Indicative prices:
      </p>
      <ul>
        <li><strong>Day rate</strong> (06:00-22:00 for two-rate meters): ~0.22-0.30 BGN/kWh.</li>
        <li><strong>Night rate</strong> (22:00-06:00): ~0.13-0.18 BGN/kWh.</li>
        <li><strong>Single rate</strong> (standard meter): ~0.22-0.26 BGN/kWh.</li>
      </ul>
      <p>
        Real prices vary by supplier and plan. We recommend checking your
        invoice — the actual kWh price is on the back. If you have a two-rate
        meter and use AC mostly at night (Sleep mode), real cost is ~30% lower
        than the tables.
      </p>

      <h2>8 ways to cut the bill by up to 40%</h2>
      <ol>
        <li><strong>Set temperature to 25-26°C</strong> instead of 22°C. This alone saves 30-40%.</li>
        <li><strong>Activate Sleep mode</strong> for the night. The unit optimizes itself.</li>
        <li><strong>Annual maintenance.</strong> Clogged filter = -25% efficiency = -25% of your money.</li>
        <li><strong>Use Dry mode</strong> in mild days instead of Cool. 50% lower consumption.</li>
        <li><strong>Close blinds and curtains</strong> on south-facing windows during the day. Reduces thermal load.</li>
        <li><strong>Use night rate</strong> — night cooldown to 22°C, then Sleep, then morning off.</li>
        <li><strong>Don&apos;t run AC in an empty room</strong> &quot;just in case&quot;. AC doesn&apos;t &quot;hold&quot; temperature — it responds to need.</li>
        <li><strong>Replace old A-class units with A++ inverter.</strong> Pays off in 1-2 seasons.</li>
      </ol>

      <h2>Inverter vs non-inverter — real annual difference</h2>
      <p>
        A non-inverter AC works on &quot;on/off&quot; principle — once it
        reaches target temperature, it cuts the compressor. Then temperature
        rises, it restarts. Every start consumes a large surge of electricity
        (motor inrush current).
      </p>
      <p>
        An inverter modulates the compressor frequency — runs at lower power
        continuously. Savings: <strong>30-40% per year</strong>.
      </p>
      <p>
        For a typical Varna apartment, year-round inverter vs non-inverter
        difference:
      </p>
      <ul>
        <li>Non-inverter A: ~650-800 BGN/year per unit</li>
        <li>Inverter A++: ~380-480 BGN/year</li>
        <li><strong>Savings: ~270-320 BGN/year</strong></li>
      </ul>
      <p>
        Over 7-10 years of unit life — 2000-3000 BGN saved. That&apos;s more
        than the cost of the AC itself.
      </p>

      <h2>What to do now</h2>
      <p>
        First: <strong>lower the temperature from current to 25-26°C</strong>
        and enable Sleep mode at night. That&apos;s free 30-40% savings this
        month.
      </p>
      <p>
        Second: if your AC is A-class (bought before 2018) — calculate if it
        makes sense to replace it. Often the difference pays off in 2-3
        seasons. You can ask our AI consultant on the site for a specific
        recommendation for your situation.
      </p>
      <p>
        Third: if you haven&apos;t done maintenance this year — book it. 25%
        of nothing can&apos;t be fixed by any setting. Request via the form
        on the site or call us.
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
      <h2>Короткий ответ: сколько реально платите?</h2>
      <p>
        Для типичной квартиры во Варне с инверторным кондиционером 12000 BTU
        класса А++ расход на электричество за летний месяц —
        <strong> 50-110 лв</strong> (~25-55 €). Если используете аппарат 6-8
        часов в день на правильных настройках (25-26°C), счёт будет ближе к
        нижней границе. Если держите 22°C круглосуточно — к верхней и выше.
      </p>
      <p>
        В этой статье — конкретные числа для каждого типа: 9000, 12000, 18000,
        24000 BTU. Реальная формула, тарифы Варны и 8 способов срезать счёт до
        40% без жертв комфорта.
      </p>

      <h2>Формула расчёта</h2>
      <p>Расход считается по простой формуле:</p>
      <p>
        <strong>Расход (лв) = Мощность (kW) × Часы × Цена (лв/kWh) ÷ SEER</strong>
      </p>
      <p>Где:</p>
      <ul>
        <li><strong>Мощность в kW</strong> — для 12000 BTU холодильная мощность ~3.5 kW, но реально потребляемая электрическая мощность значительно меньше благодаря SEER.</li>
        <li><strong>SEER (Seasonal Energy Efficiency Ratio)</strong> — сколько &quot;охлаждения&quot; получаете на каждый kW потреблённого тока. Современный А++ инвертор имеет SEER 6.5-8.5. То есть для 3.5 kW охлаждения реально тратите 0.4-0.55 kW электричества.</li>
        <li><strong>Цена тока</strong> — во Варне для бытовых клиентов ~0.22-0.30 лв/kWh дневной, ~0.13-0.18 лв/kWh ночной (свободный рынок с 2025 г. — реальные цены зависят от вашего поставщика).</li>
      </ul>

      <h2>Таблица: расход в BGN по типу аппарата</h2>
      <p>
        Реальный месячный расход при дневной тарифе ~0.27 лв/kWh, нормальное
        использование, инвертор А++. Цифры — чистый &quot;ток на кондиционер&quot;,
        не весь счёт.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">BTU</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">На площадь</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">4 ч/день</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">8 ч/день</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">12 ч/день</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">9 000</td>
              <td className="px-4 py-3 border border-border/60">до 20 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~25 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~50 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~75 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">12 000</td>
              <td className="px-4 py-3 border border-border/60">20-30 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~35 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~70 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~105 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">18 000</td>
              <td className="px-4 py-3 border border-border/60">30-45 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~55 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~110 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~165 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">24 000</td>
              <td className="px-4 py-3 border border-border/60">45-60 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~75 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~150 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~225 лв</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        <em>Примечание:</em> при работе в Sleep mode ночью с ночной тарифой
        реальные цифры на 30-40% ниже. Таблица — для дневной тарифы.
      </p>

      <h2>Почему SEER важнее BTU для счёта</h2>
      <p>
        Два кондиционера с одинаковой мощностью 12000 BTU могут отличаться по
        расходу <strong>в 2 раза</strong>. Почему? Из-за коэффициента SEER.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Энергокласс</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">SEER</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Расход 8ч/день (12k BTU)</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">За сезон (3 месяца)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">A (старый)</td>
              <td className="px-4 py-3 border border-border/60">3.2</td>
              <td className="px-4 py-3 border border-border/60 text-right">~130 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~390 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">A+</td>
              <td className="px-4 py-3 border border-border/60">5.6</td>
              <td className="px-4 py-3 border border-border/60 text-right">~85 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~255 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">A++</td>
              <td className="px-4 py-3 border border-border/60">7.0</td>
              <td className="px-4 py-3 border border-border/60 text-right">~70 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~210 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">A+++</td>
              <td className="px-4 py-3 border border-border/60">8.5+</td>
              <td className="px-4 py-3 border border-border/60 text-right">~55 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~165 лв</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Разница A vs A+++ — <strong>225 лв за сезон только на одном
        аппарате</strong>. При летнем Cool 3 месяца + зимнем Heat ещё 4 месяца
        разница 400-600 лв в год. Поэтому переплата при покупке (200-400 лв)
        отбивается за 1-2 года.
      </p>

      <h2>Реальный пример: квартира в Чайке, 70 m²</h2>
      <p>
        Двушка на 5-м этаже в Чайке, южная сторона. Один Daikin 12000 BTU
        А++ в гостиной. Семья из 3 человек, летнее использование:
      </p>
      <ul>
        <li>Утро 07:00-09:00 (2 ч) перед работой: Cool 25°C</li>
        <li>Вечер 18:00-22:00 (4 ч): Cool 25°C + Sleep последний час</li>
        <li>Ночь 22:00-07:00 (Sleep mode на 26°C): ~9 ч в экономном режиме</li>
      </ul>
      <p>
        Всего ~12 ч реальной работы в день, 9 из них в Sleep (~50% мощности).
        Эффективные &quot;полные&quot; часы — ~7.5.
      </p>
      <p>
        Результат: <strong>~65-80 лв/месяц</strong> чисто на кондиционер. За
        трёхмесячный сезон июнь-август — около 200-240 лв. Без кондиционера в
        горячем панельном доме в Чайке в августе — не вариант.
      </p>

      <h2>Лето vs Зима — когда тратит больше</h2>
      <p>
        Неожиданно, большинство варненских кондиционеров <strong>тратят больше
        летом</strong>, не зимой. Причина:
      </p>
      <ul>
        <li><strong>Лето:</strong> жара 30-36°C, разница с целью (25°C) — 5-11°C. Долгая работа.</li>
        <li><strong>Зима:</strong> редко ниже 0°C, обычно 5-10°C. Разница с целью (21°C) — 11-16°C. Больше разрыв, но Heat-режим теплового насоса эффективнее (COP 3.5-4.5). При мягких варненских зимах при одинаковых часах зима выходит дешевле.</li>
      </ul>
      <p>
        Реальное правило: <strong>в мягкие месяцы (май, сентябрь, октябрь)
        кондиционер драматически дешевле</strong> — работает кратко и в Dry
        mode. Расход падает до 15-30 лв/месяц.
      </p>

      <h2>Тарифы тока во Варне (2026)</h2>
      <p>
        Варна — зона &quot;Електроразпределение Север&quot; (раньше ЭнергоПро).
        С июля 2025 г. бытовые клиенты могут выбрать свободный рынок.
        Ориентировочные цены:
      </p>
      <ul>
        <li><strong>Дневная тарифа</strong> (06:00-22:00 для двухтарифных счётчиков): ~0.22-0.30 лв/kWh.</li>
        <li><strong>Ночная тарифа</strong> (22:00-06:00): ~0.13-0.18 лв/kWh.</li>
        <li><strong>Единая тарифа</strong> (стандартный счётчик): ~0.22-0.26 лв/kWh.</li>
      </ul>
      <p>
        Реальные цены зависят от поставщика и плана. Рекомендуем проверить
        счёт-фактуру — реальная цена за kWh на обороте. Если у вас двухтарифный
        счётчик и кондиционер работает в основном ночью (Sleep mode), реальный
        расход на 30% ниже таблиц.
      </p>

      <h2>8 способов срезать счёт до 40%</h2>
      <ol>
        <li><strong>Поставьте температуру на 25-26°C</strong> вместо 22°C. Только это экономит 30-40%.</li>
        <li><strong>Активируйте Sleep mode</strong> на ночь. Аппарат сам оптимизирует.</li>
        <li><strong>Ежегодная профилактика.</strong> Забитый фильтр = -25% эффективности = -25% ваших денег.</li>
        <li><strong>Используйте Dry mode</strong> в мягкие дни вместо Cool. 50% меньше расход.</li>
        <li><strong>Закрывайте жалюзи и шторы</strong> на южных окнах днём. Уменьшаете тепловую нагрузку.</li>
        <li><strong>Используйте ночную тарифу</strong> — ночное охлаждение до 22°C, потом Sleep, потом выключение утром.</li>
        <li><strong>Не оставляйте аппарат в пустой комнате</strong> &quot;на всякий случай&quot;. Кондиционер не &quot;держит&quot; температуру — он реагирует на потребность.</li>
        <li><strong>Замените старые А-класс на А++ инвертор.</strong> Окупится за 1-2 сезона.</li>
      </ol>

      <h2>Инвертор vs неинвертор — реальная годовая разница</h2>
      <p>
        Неинверторный кондиционер работает по принципу &quot;вкл/выкл&quot; —
        как достиг температуры, выключает компрессор. Потом температура
        поднимается, он снова стартует. Каждый старт = большой всплеск тока
        (стартовый ток электромотора).
      </p>
      <p>
        Инверторный регулирует частоту компрессора — работает на меньшей
        мощности постоянно. Экономия: <strong>30-40% в год</strong>.
      </p>
      <p>
        Для типичной квартиры во Варне годовая разница инвертор vs неинвертор:
      </p>
      <ul>
        <li>Неинвертор A: ~650-800 лв/год на один аппарат</li>
        <li>Инвертор A++: ~380-480 лв/год</li>
        <li><strong>Экономия: ~270-320 лв/год</strong></li>
      </ul>
      <p>
        За 7-10 лет жизни аппарата — 2000-3000 лв экономии. Это больше
        стоимости самого кондиционера.
      </p>

      <h2>Что делать сейчас</h2>
      <p>
        Первое: <strong>снизьте температуру с текущей на 25-26°C</strong> и
        включите Sleep mode на ночь. Это бесплатная экономия 30-40% уже в этом
        месяце.
      </p>
      <p>
        Второе: если ваш кондиционер класса А (куплен до 2018 г.) — посчитайте,
        стоит ли его менять. Часто разница окупается за 2-3 сезона. Можете
        спросить нашего AI-консультанта на сайте конкретную рекомендацию под
        вашу ситуацию.
      </p>
      <p>
        Третье: если не делали профилактику в этом году — сделайте. 25%
        эффективности ни на чём не исправишь никакой настройкой. Запишитесь
        через форму на сайте или позвоните.
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
      <h2>Коротка відповідь: скільки реально платите?</h2>
      <p>
        Для типової квартири у Варні з інверторним кондиціонером 12000 BTU
        класу А++ витрата на електрику за літній місяць —
        <strong> 50-110 лв</strong> (~25-55 €, ~1100-2400 грн). Якщо
        використовуєте апарат 6-8 годин на день на правильних налаштуваннях
        (25-26°C), рахунок буде ближче до нижньої межі. Якщо тримаєте 22°C
        цілодобово — до верхньої й вище.
      </p>
      <p>
        У статті — конкретні числа для кожного типу: 9000, 12000, 18000, 24000
        BTU. Реальна формула, тарифи Варни та 8 способів зрізати рахунок до
        40% без жертв комфорту.
      </p>

      <h2>Формула розрахунку</h2>
      <p>Витрата рахується за простою формулою:</p>
      <p>
        <strong>Витрата (лв) = Потужність (kW) × Години × Ціна (лв/kWh) ÷ SEER</strong>
      </p>
      <p>Де:</p>
      <ul>
        <li><strong>Потужність у kW</strong> — для 12000 BTU холодильна потужність ~3.5 kW, але реально спожита електрична потужність значно менша завдяки SEER.</li>
        <li><strong>SEER (Seasonal Energy Efficiency Ratio)</strong> — скільки &quot;охолодження&quot; отримуєте на кожен kW спожитого струму. Сучасний А++ інвертор має SEER 6.5-8.5. Тобто для 3.5 kW охолодження реально витрачаєте 0.4-0.55 kW електрики.</li>
        <li><strong>Ціна струму</strong> — у Варні для побутових клієнтів ~0.22-0.30 лв/kWh денний, ~0.13-0.18 лв/kWh нічний (вільний ринок з 2025 р. — реальні ціни залежать від вашого постачальника).</li>
      </ul>

      <h2>Таблиця: витрата в BGN за типом апарата</h2>
      <p>
        Реальна місячна витрата за денним тарифом ~0.27 лв/kWh, нормальне
        використання, інвертор А++. Цифри — чистий &quot;струм на кондиціонер&quot;,
        не весь рахунок.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">BTU</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">На площу</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">4 г/день</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">8 г/день</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">12 г/день</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">9 000</td>
              <td className="px-4 py-3 border border-border/60">до 20 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~25 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~50 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~75 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">12 000</td>
              <td className="px-4 py-3 border border-border/60">20-30 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~35 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~70 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~105 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">18 000</td>
              <td className="px-4 py-3 border border-border/60">30-45 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~55 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~110 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~165 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">24 000</td>
              <td className="px-4 py-3 border border-border/60">45-60 m²</td>
              <td className="px-4 py-3 border border-border/60 text-right">~75 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~150 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~225 лв</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        <em>Примітка:</em> при роботі в Sleep mode уночі з нічним тарифом
        реальні цифри на 30-40% нижчі. Таблиця — для денного тарифу.
      </p>

      <h2>Чому SEER важливіший за BTU для рахунку</h2>
      <p>
        Два кондиціонери з однаковою потужністю 12000 BTU можуть відрізнятися
        за витратою <strong>удвічі</strong>. Чому? Через коефіцієнт SEER.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Енергоклас</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">SEER</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Витрата 8г/день (12k BTU)</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">За сезон (3 місяці)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">A (старий)</td>
              <td className="px-4 py-3 border border-border/60">3.2</td>
              <td className="px-4 py-3 border border-border/60 text-right">~130 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~390 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">A+</td>
              <td className="px-4 py-3 border border-border/60">5.6</td>
              <td className="px-4 py-3 border border-border/60 text-right">~85 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~255 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">A++</td>
              <td className="px-4 py-3 border border-border/60">7.0</td>
              <td className="px-4 py-3 border border-border/60 text-right">~70 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~210 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">A+++</td>
              <td className="px-4 py-3 border border-border/60">8.5+</td>
              <td className="px-4 py-3 border border-border/60 text-right">~55 лв</td>
              <td className="px-4 py-3 border border-border/60 text-right">~165 лв</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Різниця A vs A+++ — <strong>225 лв за сезон лише на одному
        апараті</strong>. При літньому Cool 3 місяці + зимовому Heat ще 4
        місяці різниця 400-600 лв на рік. Тому переплата при покупці (200-400
        лв) відбивається за 1-2 роки.
      </p>

      <h2>Реальний приклад: квартира в Чайці, 70 m²</h2>
      <p>
        Двокімнатна квартира на 5-му поверсі в Чайці, південна сторона. Один
        Daikin 12000 BTU А++ у вітальні. Сім&apos;я з 3 осіб, літнє
        використання:
      </p>
      <ul>
        <li>Ранок 07:00-09:00 (2 г) перед роботою: Cool 25°C</li>
        <li>Вечір 18:00-22:00 (4 г): Cool 25°C + Sleep останню годину</li>
        <li>Ніч 22:00-07:00 (Sleep mode на 26°C): ~9 г в економному режимі</li>
      </ul>
      <p>
        Усього ~12 г реальної роботи на день, 9 з них у Sleep (~50% потужності).
        Ефективні &quot;повні&quot; години — ~7.5.
      </p>
      <p>
        Результат: <strong>~65-80 лв/місяць</strong> чисто на кондиціонер. За
        тримісячний сезон червень-серпень — близько 200-240 лв. Без
        кондиціонера в гарячому панельному будинку в Чайці у серпні — не
        варіант.
      </p>

      <h2>Літо vs Зима — коли витрачає більше</h2>
      <p>
        Несподівано, більшість варненських кондиціонерів <strong>витрачають
        більше влітку</strong>, не взимку. Причина:
      </p>
      <ul>
        <li><strong>Літо:</strong> спека 30-36°C, різниця з ціллю (25°C) — 5-11°C. Довга робота.</li>
        <li><strong>Зима:</strong> рідко нижче 0°C, зазвичай 5-10°C. Різниця з ціллю (21°C) — 11-16°C. Більший розрив, але Heat-режим теплового насоса ефективніший (COP 3.5-4.5). При м&apos;яких варненських зимах при однакових годинах зима виходить дешевше.</li>
      </ul>
      <p>
        Реальне правило: <strong>у м&apos;які місяці (травень, вересень,
        жовтень) кондиціонер драматично дешевший</strong> — працює коротко й у
        Dry mode. Витрата падає до 15-30 лв/місяць.
      </p>

      <h2>Тарифи струму у Варні (2026)</h2>
      <p>
        Варна — зона &quot;Електроразпределение Север&quot; (раніше ЕнергоПро).
        Із липня 2025 р. побутові клієнти можуть обрати вільний ринок.
        Орієнтовні ціни:
      </p>
      <ul>
        <li><strong>Денний тариф</strong> (06:00-22:00 для двотарифних лічильників): ~0.22-0.30 лв/kWh.</li>
        <li><strong>Нічний тариф</strong> (22:00-06:00): ~0.13-0.18 лв/kWh.</li>
        <li><strong>Єдиний тариф</strong> (стандартний лічильник): ~0.22-0.26 лв/kWh.</li>
      </ul>
      <p>
        Реальні ціни залежать від постачальника й плану. Рекомендуємо
        перевірити рахунок-фактуру — реальна ціна за kWh на звороті. Якщо у вас
        двотарифний лічильник і кондиціонер працює переважно вночі (Sleep
        mode), реальна витрата на 30% нижча таблиць.
      </p>

      <h2>8 способів зрізати рахунок до 40%</h2>
      <ol>
        <li><strong>Поставте температуру на 25-26°C</strong> замість 22°C. Лише це економить 30-40%.</li>
        <li><strong>Активуйте Sleep mode</strong> на ніч. Апарат сам оптимізує.</li>
        <li><strong>Щорічна профілактика.</strong> Забитий фільтр = -25% ефективності = -25% ваших грошей.</li>
        <li><strong>Використовуйте Dry mode</strong> у м&apos;які дні замість Cool. 50% менша витрата.</li>
        <li><strong>Закривайте жалюзі й штори</strong> на південних вікнах удень. Зменшуєте теплове навантаження.</li>
        <li><strong>Використовуйте нічний тариф</strong> — нічне охолодження до 22°C, потім Sleep, потім вимкнення зранку.</li>
        <li><strong>Не залишайте апарат у порожній кімнаті</strong> &quot;про всяк випадок&quot;. Кондиціонер не &quot;тримає&quot; температуру — він реагує на потребу.</li>
        <li><strong>Замініть старі А-клас на А++ інвертор.</strong> Окупиться за 1-2 сезони.</li>
      </ol>

      <h2>Інвертор vs неінвертор — реальна річна різниця</h2>
      <p>
        Неінверторний кондиціонер працює за принципом &quot;увімк/вимк&quot; —
        як досяг температури, вимикає компресор. Потім температура
        піднімається, він знову стартує. Кожен старт = великий сплеск струму
        (стартовий струм електромотора).
      </p>
      <p>
        Інверторний регулює частоту компресора — працює на меншій потужності
        постійно. Економія: <strong>30-40% на рік</strong>.
      </p>
      <p>
        Для типової квартири у Варні річна різниця інвертор vs неінвертор:
      </p>
      <ul>
        <li>Неінвертор A: ~650-800 лв/рік на один апарат</li>
        <li>Інвертор A++: ~380-480 лв/рік</li>
        <li><strong>Економія: ~270-320 лв/рік</strong></li>
      </ul>
      <p>
        За 7-10 років життя апарата — 2000-3000 лв економії. Це більше
        вартості самого кондиціонера.
      </p>

      <h2>Що робити зараз</h2>
      <p>
        Перше: <strong>знизьте температуру з поточної на 25-26°C</strong> і
        увімкніть Sleep mode на ніч. Це безкоштовна економія 30-40% уже цього
        місяця.
      </p>
      <p>
        Друге: якщо ваш кондиціонер класу А (куплений до 2018 р.) — порахуйте,
        чи варто його міняти. Часто різниця окупається за 2-3 сезони. Можете
        запитати нашого AI-консультанта на сайті конкретну рекомендацію під
        вашу ситуацію.
      </p>
      <p>
        Третє: якщо не робили профілактику цього року — зробіть. 25%
        ефективності ні на чому не виправити жодним налаштуванням. Запишіться
        через форму на сайті або зателефонуйте.
      </p>
    </>
  );
}

export const electricityCostAcVarna: BlogPost = {
  slug: "electricity-cost-ac-varna",
  date: "2026-05-15",
  image: "/images/blog/electricity-cost-ac-varna.jpg",
  readingTime: {
    bg: "9 мин",
    en: "9 min",
    ru: "9 мин",
    ua: "9 хв",
  },
  title: {
    bg: "Колко ток харчи климатик във Варна — реални цени, формула и как да отрежете 40%",
    en: "How Much Electricity Does an AC Use in Varna — Real Prices, Formula, and How to Cut 40%",
    ru: "Сколько электричества потребляет кондиционер во Варне — реальные цены, формула и как срезать 40%",
    ua: "Скільки електрики споживає кондиціонер у Варні — реальні ціни, формула та як зрізати 40%",
  },
  excerpt: {
    bg: "Реален месечен разход в BGN за 9k/12k/18k/24k BTU, защо SEER е по-важен от BTU, тарифите във Варна и 8 практични начина да отрежете сметката с до 40%.",
    en: "Real monthly cost in BGN for 9k/12k/18k/24k BTU, why SEER matters more than BTU, Varna tariffs, and 8 practical ways to cut your bill by up to 40%.",
    ru: "Реальный месячный расход в BGN для 9k/12k/18k/24k BTU, почему SEER важнее BTU, тарифы Варны и 8 практических способов срезать счёт до 40%.",
    ua: "Реальна місячна витрата в BGN для 9k/12k/18k/24k BTU, чому SEER важливіший за BTU, тарифи Варни та 8 практичних способів зрізати рахунок до 40%.",
  },
  keywords: {
    bg: ["колко ток харчи климатик", "разход ток климатик Варна", "цена ток климатик", "икономия ток климатик", "SEER коефициент", "инвертор климатик ток"],
    en: ["AC electricity cost", "air conditioner power consumption", "AC bill Varna", "save electricity AC", "SEER coefficient", "inverter AC consumption"],
    ru: ["сколько электричества кондиционер", "расход электричества кондиционер Варна", "цена тока кондиционер", "экономия тока кондиционер", "SEER коэффициент", "инвертор кондиционер ток"],
    ua: ["скільки електрики кондиціонер", "витрата електрики кондиціонер Варна", "ціна струму кондиціонер", "економія струму кондиціонер", "SEER коефіцієнт", "інвертор кондиціонер струм"],
  },
  content: {
    bg: ContentBG,
    en: ContentEN,
    ru: ContentRU,
    ua: ContentUA,
  },
  faq: {
    bg: [
      { question: "Колко струва ток за климатик 12000 BTU на месец във Варна?", answer: "За инверторен модел А++ при 8 часа дневна работа — около 70 лв на месец. При 12 часа дневно — около 105 лв. Sleep mode през нощта сваля разхода с 30-40%." },
      { question: "Защо два климатика с еднакви BTU имат различен разход?", answer: "Заради SEER коефициента. Стар клас А има SEER 3.2, а модерен А+++ — над 8.5. Реалната разлика в годишния разход за един уред е 200-400 лв." },
      { question: "Кога харчи повече — лятото или зимата?", answer: "За Варна обикновено лятото. Жегите 32-36°C изискват дълга работа на компресора. Зимата термопомпеният режим е по-ефективен (COP 3.5-4.5), а температурните разлики обикновено са по-малки." },
      { question: "Изплаща ли се да сменя стар климатик А-клас с нов А++?", answer: "Да. Икономията е 270-320 лв годишно за един уред. Цената на новия (1200-1800 лв) се изплаща за 4-5 години, но за 7-10 години живот общата спестявка достига 2000-3000 лв." },
      { question: "Влияе ли Sleep mode реално на сметката?", answer: "Да, 20-30% за цяла нощ. Уредът постепенно повишава температурата, намалява вентилатора и след 7-8 часа влиза в най-икономичен режим. Безплатна функция на всеки модерен климатик." },
    ],
    en: [
      { question: "How much does electricity for a 12000 BTU AC cost per month in Varna?", answer: "For an A++ inverter at 8 hours daily — about 70 BGN per month. At 12 hours daily — about 105 BGN. Sleep mode at night brings the cost down 30-40%." },
      { question: "Why do two ACs with the same BTU have different consumption?", answer: "Because of the SEER coefficient. Old A class has SEER 3.2, modern A+++ — over 8.5. The real annual difference per unit is 200-400 BGN." },
      { question: "When does AC use more — summer or winter?", answer: "For Varna usually summer. Heat 32-36°C requires long compressor runtime. In winter heat pump mode is more efficient (COP 3.5-4.5) and temperature gaps are usually smaller." },
      { question: "Does it pay off to replace an old A-class AC with a new A++?", answer: "Yes. Savings are 270-320 BGN per year per unit. New AC price (1200-1800 BGN) pays off in 4-5 years, but over 7-10 years of life total savings reach 2000-3000 BGN." },
      { question: "Does Sleep mode really affect the bill?", answer: "Yes, 20-30% per night. The unit gradually raises temperature, slows the fan, and after 7-8 hours enters the most economical mode. Free feature on every modern AC." },
    ],
    ru: [
      { question: "Сколько стоит ток для кондиционера 12000 BTU в месяц во Варне?", answer: "Для инвертора А++ при 8 часах ежедневно — около 70 лв в месяц. При 12 часах — около 105 лв. Sleep mode ночью снижает расход на 30-40%." },
      { question: "Почему два кондиционера с одинаковыми BTU имеют разный расход?", answer: "Из-за коэффициента SEER. Старый класс А имеет SEER 3.2, современный А+++ — выше 8.5. Реальная годовая разница на один аппарат — 200-400 лв." },
      { question: "Когда тратит больше — летом или зимой?", answer: "Для Варны обычно летом. Жара 32-36°C требует долгой работы компрессора. Зимой режим теплового насоса эффективнее (COP 3.5-4.5), а температурные перепады обычно меньше." },
      { question: "Окупается ли замена старого А-класса на новый А++?", answer: "Да. Экономия 270-320 лв в год на аппарат. Цена нового (1200-1800 лв) окупается за 4-5 лет, но за 7-10 лет жизни общая экономия — 2000-3000 лв." },
      { question: "Sleep mode реально влияет на счёт?", answer: "Да, 20-30% за ночь. Аппарат постепенно повышает температуру, замедляет вентилятор и через 7-8 часов переходит в самый экономный режим. Бесплатная функция на любом современном кондиционере." },
    ],
    ua: [
      { question: "Скільки коштує струм для кондиціонера 12000 BTU на місяць у Варні?", answer: "Для інвертора А++ при 8 годинах щодня — близько 70 лв на місяць. При 12 годинах — близько 105 лв. Sleep mode уночі знижує витрату на 30-40%." },
      { question: "Чому два кондиціонери з однаковими BTU мають різну витрату?", answer: "Через коефіцієнт SEER. Старий клас А має SEER 3.2, сучасний А+++ — понад 8.5. Реальна річна різниця на один апарат — 200-400 лв." },
      { question: "Коли витрачає більше — улітку чи взимку?", answer: "Для Варни зазвичай улітку. Спека 32-36°C вимагає тривалої роботи компресора. Узимку режим теплового насоса ефективніший (COP 3.5-4.5), а температурні перепади зазвичай менші." },
      { question: "Чи окупається заміна старого А-класу на новий А++?", answer: "Так. Економія 270-320 лв на рік на апарат. Ціна нового (1200-1800 лв) окупається за 4-5 років, але за 7-10 років життя загальна економія — 2000-3000 лв." },
      { question: "Sleep mode реально впливає на рахунок?", answer: "Так, 20-30% за ніч. Апарат поступово підвищує температуру, уповільнює вентилятор і через 7-8 годин переходить у найекономніший режим. Безкоштовна функція на будь-якому сучасному кондиціонері." },
    ],
  },
};
