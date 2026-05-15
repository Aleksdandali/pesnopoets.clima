import type { BlogPost } from "../types";

/* ------------------------------------------------------------------ */
/*  BG content                                                         */
/* ------------------------------------------------------------------ */
function ContentBG() {
  return (
    <>
      <h2>Защо правилните настройки спестяват до 35% от сметката</h2>
      <p>
        Климатикът, който сте купили, може да работи с А++ енергиен клас и
        пълна гаранция, но ако режимът и температурата са грешни — сметката за
        ток ще е с 25-35% по-висока, а уредът ще се износва двойно по-бързо.
        Това е най-евтината &quot;инвестиция&quot;, която можете да направите:
        просто завъртете 2-3 копчета правилно.
      </p>
      <p>
        В тази статия даваме конкретни числа: каква температура за лятото във
        Варна, защо режимът Dry е критичен за нашия крайморски климат, кога
        Sleep mode реално помага и кои 7 грешки правят почти всички потребители.
      </p>

      <h2>Основните режими — Cool, Heat, Dry, Fan, Auto</h2>
      <p>
        Дистанционното има 5 основни режима. Всеки от тях е за различна
        ситуация — не за &quot;по-силно охлаждане&quot;.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Режим</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Какво прави</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Кога да го пуснете</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Cool ❄️</td>
              <td className="px-4 py-3 border border-border/60">Охлажда въздуха до зададената температура</td>
              <td className="px-4 py-3 border border-border/60">Лято, навън над 24°C</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Heat ☀️</td>
              <td className="px-4 py-3 border border-border/60">Затопля стаята — работи като термопомпа</td>
              <td className="px-4 py-3 border border-border/60">Зима, навън под 15°C</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Dry 💧</td>
              <td className="px-4 py-3 border border-border/60">Намалява влажността, без силно охлаждане</td>
              <td className="px-4 py-3 border border-border/60">Влажни летни дни, есенни валежи</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Fan 🌀</td>
              <td className="px-4 py-3 border border-border/60">Само вентилира — не охлажда, не топли</td>
              <td className="px-4 py-3 border border-border/60">Циркулация на въздуха, без енергия за компресора</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Auto</td>
              <td className="px-4 py-3 border border-border/60">Уредът сам избира режим според температурата</td>
              <td className="px-4 py-3 border border-border/60">Преходни сезони — пролет, есен</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Идеална температура за лятото във Варна</h2>
      <p>
        Тук правят грешка над 70% от потребителите. Когато навън е 32°C, не
        слагайте 18°C на дистанционното. Не работи така — уредът не охлажда
        &quot;по-бързо&quot;, той просто работи на 100% мощност докато стигне
        невъзможно ниската цел. Разходът на ток е драматично по-висок, а
        компресорът се износва.
      </p>
      <p>
        <strong>Правилната летна настройка: 24-26°C</strong>
      </p>
      <ul>
        <li><strong>26°C</strong> — оптимално за дневна стая, кабинет, кухня. Тялото не усеща дискомфорт от разликата с външната температура.</li>
        <li><strong>25°C</strong> — за стая с прозорец на южна или западна страна, директно слънце следобед.</li>
        <li><strong>24°C</strong> — за последен етаж под покрив, или ако имате гости и стаята е претъпкана.</li>
      </ul>
      <p>
        Разликата между 22°C и 26°C в сметката за ток е около <strong>40%</strong>.
        Това е реална пара, не теория. Всеки градус под 24°C ви струва допълнително
        6-8% от сметката.
      </p>

      <h3>Правилото &quot;разлика 7°C&quot;</h3>
      <p>
        Здравословната разлика между външната и вътрешната температура е 5-7°C.
        При външни 32°C — вътре 25-26°C. При външни 36°C — вътре 25°C максимум.
        По-голяма разлика води до настинки, схванат врат и сухи лигавици.
      </p>

      <h2>Идеална температура за зимата</h2>
      <p>
        Климатикът може да отоплява — режим Heat работи като термопомпа. За
        Варна, където зимите рядко слизат под -5°C, това е най-евтиният начин
        за отопление (вижте нашата статия за отопление с климатик).
      </p>
      <p>
        <strong>Правилната зимна настройка: 20-22°C</strong>
      </p>
      <ul>
        <li><strong>22°C</strong> — дневна стая, където прекарвате повечето време.</li>
        <li><strong>20-21°C</strong> — кабинет, кухня (там и без това има готварски топлини).</li>
        <li><strong>18-19°C</strong> — спалня нощем (за по-добър сън).</li>
      </ul>
      <p>
        Не пускайте 26°C през зимата. Това е същата грешка като 18°C през
        лятото — уредът работи на максимум, разходът скача, а тялото се
        задушава в горещ въздух.
      </p>

      <h2>Режим Dry — защо за Варна е критичен</h2>
      <p>
        Варна е крайморски град. Средната относителна влажност през лятото е
        70-80%, а есента може да стигне 90%. Това е значително над здравословната
        норма (40-60%). Резултатите от прекомерна влажност: мухъл по стените,
        акари, миризма на &quot;старо&quot; в дрехите, лоша концентрация.
      </p>
      <p>
        Режим <strong>Dry (💧 икона на капка)</strong> е създаден точно за това.
        Уредът охлажда леко, но основната му работа е да изсушава въздуха,
        прекарвайки го през изпарителя. Разходът на ток е значително по-нисък
        от пълен режим Cool — около 40-50% от обикновения разход.
      </p>
      <p>
        Кога да го пуснете:
      </p>
      <ul>
        <li>Дъждовни летни дни — когато не е горещо, но е лепкаво.</li>
        <li>Есен (септември-октомври) — за избягване на мухъл.</li>
        <li>След баня, при простиране на дрехи вкъщи.</li>
        <li>Сутрин преди работа — кратки 30-40 минути за свеж въздух.</li>
      </ul>

      <h2>Sleep mode — какво наистина прави</h2>
      <p>
        Sleep mode (или Night mode) е най-неразбраната функция. Не е просто
        &quot;тих режим&quot;. Уредът прави следното:
      </p>
      <ul>
        <li>Постепенно повишава температурата с 1-2°C през първите 2 часа (за лятото) или я понижава (за зимата) — съобразено с биоритъма на тялото при сън.</li>
        <li>Намалява скоростта на вентилатора до минимум — тих режим.</li>
        <li>Изключва индикаторните лампички — за по-добро затъмнение.</li>
        <li>След 7-8 часа автоматично се изключва или влиза в най-икономичен режим.</li>
      </ul>
      <p>
        Реалната икономия в Sleep mode за цяла нощ е <strong>20-30%</strong>
        спрямо обикновен Cool с фиксирана температура. Сложете 25°C преди лягане,
        натиснете Sleep — уредът ще тръгне към 27°C до сутринта без вие да
        усещате нищо.
      </p>

      <h2>Eco, Power, Turbo, Quiet — какво всъщност значат</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Функция</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Какво прави</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Препоръка</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Eco</td>
              <td className="px-4 py-3 border border-border/60">Ограничава максималната мощност на компресора до ~75%</td>
              <td className="px-4 py-3 border border-border/60">Включете го за дълги периоди (8+ часа)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Turbo / Powerful</td>
              <td className="px-4 py-3 border border-border/60">Максимална мощност за 20-30 мин, после се връща нормален режим</td>
              <td className="px-4 py-3 border border-border/60">Само при прибиране в нагорещен апартамент</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Quiet</td>
              <td className="px-4 py-3 border border-border/60">Намалява шума на външното тяло до ~45 dB</td>
              <td className="px-4 py-3 border border-border/60">Вечер, ако имате близки съседи</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">i-Feel / Follow Me</td>
              <td className="px-4 py-3 border border-border/60">Сензор в дистанционното отчита температурата до вас</td>
              <td className="px-4 py-3 border border-border/60">Голяма стая, ако стоите далеч от вътрешното тяло</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Позиция на вентилатора и хоризонталните перки</h2>
      <p>
        Бутонът &quot;Swing&quot; пуска автоматично движение на перките. Това
        не е козметична функция — има реално значение за разпределението на
        въздуха.
      </p>
      <ul>
        <li><strong>Лято (охлаждане):</strong> перките трябва да са насочени <em>нагоре</em> (хоризонтално). Студеният въздух е по-плътен, пада надолу естествено.</li>
        <li><strong>Зима (отопление):</strong> перките трябва да са <em>надолу</em>. Топлият въздух се качва, иначе таванът ви ще е топъл, а краката — студени.</li>
        <li><strong>Auto Swing</strong> работи добре като компромис, но фиксираното положение спестява още 5-8%.</li>
      </ul>

      <h2>7-те най-чести грешки в настройките</h2>
      <ol>
        <li><strong>Слагате 18°C, мислейки че &quot;охлажда по-бързо&quot;.</strong> Не охлажда по-бързо — работи на 100% и ви изпразва портфейла.</li>
        <li><strong>Не ползвате Dry mode при влажност.</strong> 75% влажност + 28°C се усеща като 33°C. Dry mode решава точно това.</li>
        <li><strong>Държите перките надолу през лятото.</strong> Топлият въздух остава горе, студеният — около краката. Чувството за охлаждане е невярно.</li>
        <li><strong>Не пускате Sleep mode нощем.</strong> Цяла нощ на 23°C = надплащане 20-30% за нула допълнителен комфорт.</li>
        <li><strong>Включвате Turbo и забравяте.</strong> Turbo е за 20-30 минути, не за 8 часа. След първоначалното охлаждане преминете на 25°C.</li>
        <li><strong>Затваряте всички врати.</strong> При мулти-сплит или централна циркулация — добре. При обикновен сплит — затворената врата го кара да работи срещу &quot;каменна стена&quot;.</li>
        <li><strong>Не правите профилактика.</strong> Запушен филтър = -25% ефективност. Дори перфектните настройки не помагат при мръсен уред.</li>
      </ol>

      <h2>Сезонна стратегия за Варна</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Сезон</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Режим</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Температура</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Бележка</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">Юни-Август</td>
              <td className="px-4 py-3 border border-border/60">Cool</td>
              <td className="px-4 py-3 border border-border/60">25-26°C</td>
              <td className="px-4 py-3 border border-border/60">Sleep mode нощем</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Май, Септември</td>
              <td className="px-4 py-3 border border-border/60">Dry или Auto</td>
              <td className="px-4 py-3 border border-border/60">24°C</td>
              <td className="px-4 py-3 border border-border/60">Влажност е по-голям проблем от температурата</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Октомври</td>
              <td className="px-4 py-3 border border-border/60">Dry или Fan</td>
              <td className="px-4 py-3 border border-border/60">22°C</td>
              <td className="px-4 py-3 border border-border/60">Превенция от мухъл</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Ноември-Март</td>
              <td className="px-4 py-3 border border-border/60">Heat</td>
              <td className="px-4 py-3 border border-border/60">20-22°C</td>
              <td className="px-4 py-3 border border-border/60">Перките надолу</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Април</td>
              <td className="px-4 py-3 border border-border/60">Auto</td>
              <td className="px-4 py-3 border border-border/60">22°C</td>
              <td className="px-4 py-3 border border-border/60">Уредът избира сам според деня</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Специфика за Варна — какво е различно при нас</h2>
      <ul>
        <li>
          <strong>Морски бриз:</strong> следобед откъм морето идва прохладен
          въздух с висока влажност. Често е по-добре да изключите климатика и да
          отворите прозореца за 30-40 минути.
        </li>
        <li>
          <strong>Висока влажност:</strong> 70-85% през лятото означава, че Dry
          mode е почти задължителен поне 1-2 часа дневно. Това не е лукс — това е
          превенция от мухъл.
        </li>
        <li>
          <strong>Последни етажи:</strong> в Чайка, Виница, Аспарухово —
          панелните блокове с южно изложение се нагряват до 35-40°C на тавана.
          На последен етаж сложете 24°C, не 25°C, плюс Eco mode.
        </li>
        <li>
          <strong>Морски апартаменти:</strong> ако сте на първа линия (Галата,
          Морска градина), солта в въздуха ускорява корозията на външното тяло.
          Не оставяйте уреда да работи 24/7 — давайте му 2-3 часа почивка дневно.
        </li>
      </ul>

      <h2>Какво да направите сега</h2>
      <p>
        Вземете дистанционното. Сменете температурата от това, което е сега, на
        25°C (лято) или 21°C (зима). Натиснете режим Cool или Heat. Натиснете
        Sleep, ако е вечер. Това е целият &quot;upgrade&quot;.
      </p>
      <p>
        Ако усещате, че въпреки правилните настройки уредът не охлажда както
        преди — почти със сигурност е време за профилактика. Запушен филтър или
        дренаж намалява ефективността с 20-30%. Заявете профилактика чрез
        формата на сайта — обикновено правим в рамките на 2-3 дни.
      </p>
      <p>
        А ако обмисляте нов климатик — изберете <strong>А++ инверторен модел</strong>.
        Разликата с обикновен А-клас се изплаща за 2-3 сезона само от спестения
        ток.
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
      <h2>Why correct settings save up to 35% on your bill</h2>
      <p>
        Your air conditioner may be A++ rated with full warranty, but if the mode
        and temperature are wrong, your electricity bill will be 25-35% higher
        and the unit will wear out twice as fast. This is the cheapest
        &quot;upgrade&quot; you can make: just turn 2-3 dials correctly.
      </p>
      <p>
        This guide gives concrete numbers: the right temperature for summer in
        Varna, why Dry mode is critical for our coastal climate, when Sleep mode
        actually helps, and the 7 mistakes almost every user makes.
      </p>

      <h2>The five modes — Cool, Heat, Dry, Fan, Auto</h2>
      <p>
        Your remote has 5 main modes. Each is for a different situation — not
        for &quot;stronger cooling&quot;.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Mode</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">What it does</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">When to use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Cool ❄️</td>
              <td className="px-4 py-3 border border-border/60">Cools air to set temperature</td>
              <td className="px-4 py-3 border border-border/60">Summer, outside above 24°C</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Heat ☀️</td>
              <td className="px-4 py-3 border border-border/60">Heats the room — works as a heat pump</td>
              <td className="px-4 py-3 border border-border/60">Winter, outside below 15°C</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Dry 💧</td>
              <td className="px-4 py-3 border border-border/60">Reduces humidity without strong cooling</td>
              <td className="px-4 py-3 border border-border/60">Humid summer days, autumn rains</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Fan 🌀</td>
              <td className="px-4 py-3 border border-border/60">Ventilation only — no cooling or heating</td>
              <td className="px-4 py-3 border border-border/60">Air circulation with minimal energy</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Auto</td>
              <td className="px-4 py-3 border border-border/60">Unit picks mode by current temperature</td>
              <td className="px-4 py-3 border border-border/60">Transitional seasons — spring, autumn</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>The ideal summer temperature in Varna</h2>
      <p>
        Over 70% of users make this mistake. When it&apos;s 32°C outside, do not
        set 18°C on the remote. It doesn&apos;t work that way — the unit
        doesn&apos;t cool &quot;faster&quot;, it just runs at 100% power
        chasing an impossible target. Electricity consumption skyrockets and the
        compressor wears out.
      </p>
      <p>
        <strong>Correct summer setting: 24-26°C</strong>
      </p>
      <ul>
        <li><strong>26°C</strong> — optimal for living room, office, kitchen. Your body doesn&apos;t feel discomfort from the temperature gap with outside.</li>
        <li><strong>25°C</strong> — for rooms with south or west-facing windows, direct afternoon sun.</li>
        <li><strong>24°C</strong> — for top-floor under roof, or when the room is crowded with guests.</li>
      </ul>
      <p>
        The difference between 22°C and 26°C in your electricity bill is about
        <strong> 40%</strong>. This is real money, not theory. Every degree below
        24°C costs you an extra 6-8% on the bill.
      </p>

      <h3>The &quot;7°C difference&quot; rule</h3>
      <p>
        A healthy difference between outside and inside is 5-7°C. Outside 32°C —
        inside 25-26°C. Outside 36°C — inside 25°C maximum. Larger gaps lead to
        colds, stiff necks and dry mucous membranes.
      </p>

      <h2>The ideal winter temperature</h2>
      <p>
        An AC can heat — Heat mode runs as a heat pump. For Varna, where winters
        rarely drop below -5°C, this is the cheapest way to heat (see our article
        on heating with AC).
      </p>
      <p>
        <strong>Correct winter setting: 20-22°C</strong>
      </p>
      <ul>
        <li><strong>22°C</strong> — living room where you spend most of your time.</li>
        <li><strong>20-21°C</strong> — office, kitchen (cooking already adds heat).</li>
        <li><strong>18-19°C</strong> — bedroom at night (for better sleep).</li>
      </ul>
      <p>
        Don&apos;t set 26°C in winter. That&apos;s the same mistake as 18°C in
        summer — the unit runs at maximum, consumption spikes, and you feel
        suffocated in hot air.
      </p>

      <h2>Dry mode — why it&apos;s critical for Varna</h2>
      <p>
        Varna is a coastal city. Average summer humidity is 70-80%, and autumn
        can reach 90%. That&apos;s well above the healthy range (40-60%).
        Consequences of high humidity: mold on walls, dust mites, &quot;old&quot;
        smell in clothes, poor concentration.
      </p>
      <p>
        <strong>Dry mode (💧 droplet icon)</strong> was made exactly for this.
        The unit cools slightly, but its main job is to dehumidify the air by
        passing it through the evaporator. Power consumption is about 40-50% of
        full Cool mode.
      </p>
      <p>When to use it:</p>
      <ul>
        <li>Rainy summer days — not hot but sticky.</li>
        <li>Autumn (September-October) — to prevent mold.</li>
        <li>After showering, or when drying laundry indoors.</li>
        <li>Morning before work — short 30-40 minutes for fresh air.</li>
      </ul>

      <h2>Sleep mode — what it really does</h2>
      <p>
        Sleep mode (or Night mode) is the most misunderstood function. It&apos;s
        not just a &quot;quiet mode&quot;. The unit does the following:
      </p>
      <ul>
        <li>Gradually raises the temperature by 1-2°C over the first 2 hours (summer) or lowers it (winter) — matched to your body&apos;s sleep biorhythm.</li>
        <li>Reduces fan speed to minimum — quiet operation.</li>
        <li>Turns off indicator lights — better darkness.</li>
        <li>After 7-8 hours automatically shuts off or enters most economical mode.</li>
      </ul>
      <p>
        Real savings in Sleep mode for a full night are <strong>20-30%</strong>
        vs regular Cool with fixed temperature. Set 25°C before bed, press
        Sleep — the unit will drift to 27°C by morning without you noticing.
      </p>

      <h2>Eco, Power, Turbo, Quiet — what they actually mean</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Function</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">What it does</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Eco</td>
              <td className="px-4 py-3 border border-border/60">Caps compressor power at ~75%</td>
              <td className="px-4 py-3 border border-border/60">Use for long periods (8+ hours)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Turbo / Powerful</td>
              <td className="px-4 py-3 border border-border/60">Maximum power for 20-30 min, then back to normal</td>
              <td className="px-4 py-3 border border-border/60">Only when arriving to a hot apartment</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Quiet</td>
              <td className="px-4 py-3 border border-border/60">Reduces outdoor unit noise to ~45 dB</td>
              <td className="px-4 py-3 border border-border/60">Evenings, if neighbours are close</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">i-Feel / Follow Me</td>
              <td className="px-4 py-3 border border-border/60">Sensor in remote reads temperature at your location</td>
              <td className="px-4 py-3 border border-border/60">Large rooms where you sit far from the unit</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Fan position and horizontal louvers</h2>
      <p>
        The &quot;Swing&quot; button triggers automatic louver movement. This
        isn&apos;t cosmetic — it directly affects air distribution.
      </p>
      <ul>
        <li><strong>Summer (cooling):</strong> louvers should point <em>up</em> (horizontal). Cold air is denser and falls down naturally.</li>
        <li><strong>Winter (heating):</strong> louvers should point <em>down</em>. Hot air rises, otherwise your ceiling is warm and your feet are cold.</li>
        <li><strong>Auto Swing</strong> is a decent compromise, but a fixed position saves another 5-8%.</li>
      </ul>

      <h2>The 7 most common setting mistakes</h2>
      <ol>
        <li><strong>Setting 18°C thinking it &quot;cools faster&quot;.</strong> It doesn&apos;t — runs at 100% and empties your wallet.</li>
        <li><strong>Not using Dry mode when humid.</strong> 75% humidity + 28°C feels like 33°C. Dry mode solves exactly that.</li>
        <li><strong>Pointing louvers down in summer.</strong> Hot air stays up, cold pools around your feet. Cooling sensation is misleading.</li>
        <li><strong>Not using Sleep mode at night.</strong> All night at 23°C = overpaying 20-30% for zero extra comfort.</li>
        <li><strong>Leaving Turbo on.</strong> Turbo is for 20-30 minutes, not 8 hours. After initial cooldown, switch to 25°C.</li>
        <li><strong>Closing all doors.</strong> For multi-split or central — fine. For a regular split — a closed door makes it fight a &quot;stone wall&quot;.</li>
        <li><strong>Skipping maintenance.</strong> Clogged filter = -25% efficiency. Even perfect settings can&apos;t save a dirty unit.</li>
      </ol>

      <h2>Seasonal strategy for Varna</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Season</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Mode</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Temperature</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">June-August</td>
              <td className="px-4 py-3 border border-border/60">Cool</td>
              <td className="px-4 py-3 border border-border/60">25-26°C</td>
              <td className="px-4 py-3 border border-border/60">Sleep mode at night</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">May, September</td>
              <td className="px-4 py-3 border border-border/60">Dry or Auto</td>
              <td className="px-4 py-3 border border-border/60">24°C</td>
              <td className="px-4 py-3 border border-border/60">Humidity is a bigger issue than temperature</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">October</td>
              <td className="px-4 py-3 border border-border/60">Dry or Fan</td>
              <td className="px-4 py-3 border border-border/60">22°C</td>
              <td className="px-4 py-3 border border-border/60">Mold prevention</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">November-March</td>
              <td className="px-4 py-3 border border-border/60">Heat</td>
              <td className="px-4 py-3 border border-border/60">20-22°C</td>
              <td className="px-4 py-3 border border-border/60">Louvers pointed down</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">April</td>
              <td className="px-4 py-3 border border-border/60">Auto</td>
              <td className="px-4 py-3 border border-border/60">22°C</td>
              <td className="px-4 py-3 border border-border/60">Unit picks the right mode by day</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Varna specifics — what&apos;s different here</h2>
      <ul>
        <li>
          <strong>Sea breeze:</strong> in the afternoon the cool coastal wind
          arrives with high humidity. Often it&apos;s better to turn off the AC
          and open windows for 30-40 minutes.
        </li>
        <li>
          <strong>High humidity:</strong> 70-85% in summer means Dry mode is
          near-mandatory for at least 1-2 hours daily. Not a luxury — mold
          prevention.
        </li>
        <li>
          <strong>Top floors:</strong> in Chayka, Vinitsa, Asparuhovo —
          south-facing prefab apartments heat their attics to 35-40°C. On a top
          floor set 24°C, not 25°C, plus Eco mode.
        </li>
        <li>
          <strong>Beachfront apartments:</strong> if you&apos;re on the first
          line (Galata, Sea Garden), salt in the air accelerates corrosion of
          the outdoor unit. Don&apos;t run 24/7 — give it 2-3 hours of rest
          daily.
        </li>
      </ul>

      <h2>What to do now</h2>
      <p>
        Pick up your remote. Change the temperature to 25°C (summer) or 21°C
        (winter). Press Cool or Heat. Press Sleep if it&apos;s evening.
        That&apos;s the full &quot;upgrade&quot;.
      </p>
      <p>
        If despite correct settings the unit doesn&apos;t cool like it used to,
        it&apos;s almost certainly time for maintenance. A clogged filter or
        drain reduces efficiency by 20-30%. Request maintenance through the
        site&apos;s form — usually done within 2-3 days.
      </p>
      <p>
        And if you&apos;re considering a new AC, pick an <strong>A++ inverter
        model</strong>. The difference with a regular A-class pays off in 2-3
        seasons just from energy savings.
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
      <h2>Почему правильные настройки экономят до 35% счёта</h2>
      <p>
        Ваш кондиционер может быть класса А++ с полной гарантией, но если
        режим и температура заданы неправильно — счёт за электричество будет
        на 25-35% выше, а аппарат изнашивается вдвое быстрее. Это самый
        дешёвый &quot;апгрейд&quot;, который вы можете сделать: просто
        повернуть 2-3 регулятора правильно.
      </p>
      <p>
        В этой статье — конкретные цифры: какая температура для лета во Варне,
        почему режим Dry критичен для нашего приморского климата, когда Sleep
        mode реально помогает и какие 7 ошибок делают почти все пользователи.
      </p>

      <h2>Пять основных режимов — Cool, Heat, Dry, Fan, Auto</h2>
      <p>
        На пульте 5 базовых режимов. Каждый — для своей ситуации, а не &quot;для
        более сильного охлаждения&quot;.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Режим</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Что делает</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Когда включать</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Cool ❄️</td>
              <td className="px-4 py-3 border border-border/60">Охлаждает воздух до заданной температуры</td>
              <td className="px-4 py-3 border border-border/60">Лето, на улице выше 24°C</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Heat ☀️</td>
              <td className="px-4 py-3 border border-border/60">Греет комнату — работает как тепловой насос</td>
              <td className="px-4 py-3 border border-border/60">Зима, на улице ниже 15°C</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Dry 💧</td>
              <td className="px-4 py-3 border border-border/60">Снижает влажность без сильного охлаждения</td>
              <td className="px-4 py-3 border border-border/60">Влажные летние дни, осенние дожди</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Fan 🌀</td>
              <td className="px-4 py-3 border border-border/60">Только вентилирует — не греет, не охлаждает</td>
              <td className="px-4 py-3 border border-border/60">Циркуляция воздуха, минимальное потребление</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Auto</td>
              <td className="px-4 py-3 border border-border/60">Аппарат сам выбирает режим по температуре</td>
              <td className="px-4 py-3 border border-border/60">Межсезонье — весна, осень</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Идеальная температура летом во Варне</h2>
      <p>
        Здесь ошибаются более 70% пользователей. Когда на улице 32°C — не
        ставьте 18°C на пульте. Кондиционер не охлаждает &quot;быстрее&quot;,
        он просто работает на 100% мощности до невозможной цели. Расход
        электричества резко растёт, компрессор изнашивается.
      </p>
      <p>
        <strong>Правильная летняя настройка: 24-26°C</strong>
      </p>
      <ul>
        <li><strong>26°C</strong> — оптимально для гостиной, кабинета, кухни. Тело не чувствует дискомфорта от перепада с улицей.</li>
        <li><strong>25°C</strong> — для комнаты с окном на южную или западную сторону, прямое солнце днём.</li>
        <li><strong>24°C</strong> — для последнего этажа под крышей или если в комнате много гостей.</li>
      </ul>
      <p>
        Разница между 22°C и 26°C в счёте за электричество — около <strong>40%</strong>.
        Это реальные деньги, не теория. Каждый градус ниже 24°C стоит дополнительно
        6-8% от счёта.
      </p>

      <h3>Правило &quot;разница 7°C&quot;</h3>
      <p>
        Здоровая разница между улицей и комнатой — 5-7°C. На улице 32°C — в
        комнате 25-26°C. На улице 36°C — внутри максимум 25°C. Больший разрыв
        ведёт к простудам, скованной шее и сухим слизистым.
      </p>

      <h2>Идеальная температура зимой</h2>
      <p>
        Кондиционер умеет греть — режим Heat работает как тепловой насос. Для
        Варны, где зимы редко опускаются ниже -5°C, это самый дешёвый способ
        обогрева (см. нашу статью про обогрев кондиционером).
      </p>
      <p>
        <strong>Правильная зимняя настройка: 20-22°C</strong>
      </p>
      <ul>
        <li><strong>22°C</strong> — гостиная, где вы проводите больше всего времени.</li>
        <li><strong>20-21°C</strong> — кабинет, кухня (там и без того тепло от готовки).</li>
        <li><strong>18-19°C</strong> — спальня ночью (для лучшего сна).</li>
      </ul>
      <p>
        Не ставьте 26°C зимой. Это та же ошибка, что 18°C летом — аппарат
        работает на максимум, расход взлетает, а в горячем воздухе нечем дышать.
      </p>

      <h2>Режим Dry — почему для Варны критичен</h2>
      <p>
        Варна — приморский город. Средняя летняя влажность — 70-80%, осенью
        доходит до 90%. Это значительно выше здоровой нормы (40-60%). Последствия
        избыточной влажности: плесень на стенах, пылевые клещи, &quot;старый&quot;
        запах в одежде, плохая концентрация.
      </p>
      <p>
        Режим <strong>Dry (💧 капля)</strong> создан именно для этого. Аппарат
        слегка охлаждает, но основная задача — осушение воздуха через испаритель.
        Расход электричества — около 40-50% от полного Cool.
      </p>
      <p>Когда включать:</p>
      <ul>
        <li>Дождливые летние дни — не жарко, но липко.</li>
        <li>Осень (сентябрь-октябрь) — для профилактики плесени.</li>
        <li>После душа, если сушите бельё дома.</li>
        <li>Утром перед работой — короткие 30-40 минут для свежего воздуха.</li>
      </ul>

      <h2>Sleep mode — что он реально делает</h2>
      <p>
        Sleep mode (Night mode) — самая недопонимаемая функция. Это не просто
        &quot;тихий режим&quot;. Аппарат делает следующее:
      </p>
      <ul>
        <li>Постепенно повышает температуру на 1-2°C за первые 2 часа (летом) или понижает (зимой) — в такт биоритму сна.</li>
        <li>Снижает скорость вентилятора до минимума — тихий режим.</li>
        <li>Отключает индикаторы — лучшая темнота.</li>
        <li>Через 7-8 часов автоматически выключается или входит в самый экономный режим.</li>
      </ul>
      <p>
        Реальная экономия в Sleep mode за ночь — <strong>20-30%</strong> против
        обычного Cool с фиксированной температурой. Поставьте 25°C перед сном,
        нажмите Sleep — к утру температура мягко уйдёт к 27°C, а вы ничего не
        заметите.
      </p>

      <h2>Eco, Power, Turbo, Quiet — что они на самом деле значат</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Функция</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Что делает</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Рекомендация</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Eco</td>
              <td className="px-4 py-3 border border-border/60">Ограничивает мощность компрессора до ~75%</td>
              <td className="px-4 py-3 border border-border/60">Включайте на длинные периоды (8+ часов)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Turbo / Powerful</td>
              <td className="px-4 py-3 border border-border/60">Максимум на 20-30 мин, потом обычный режим</td>
              <td className="px-4 py-3 border border-border/60">Только при возвращении в раскалённую квартиру</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Quiet</td>
              <td className="px-4 py-3 border border-border/60">Снижает шум наружного блока до ~45 dB</td>
              <td className="px-4 py-3 border border-border/60">Вечером, если близкие соседи</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">i-Feel / Follow Me</td>
              <td className="px-4 py-3 border border-border/60">Датчик в пульте читает температуру у вас</td>
              <td className="px-4 py-3 border border-border/60">Большие комнаты, если сидите далеко от блока</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Положение вентилятора и горизонтальные жалюзи</h2>
      <p>
        Кнопка &quot;Swing&quot; запускает автоматическое движение жалюзи. Это
        не косметика — напрямую влияет на распределение воздуха.
      </p>
      <ul>
        <li><strong>Лето (охлаждение):</strong> жалюзи должны быть направлены <em>вверх</em> (горизонтально). Холодный воздух плотнее и падает вниз сам.</li>
        <li><strong>Зима (отопление):</strong> жалюзи <em>вниз</em>. Тёплый воздух поднимается, иначе потолок тёплый, а ноги холодные.</li>
        <li><strong>Auto Swing</strong> — нормальный компромисс, но фиксированное положение экономит ещё 5-8%.</li>
      </ul>

      <h2>7 самых частых ошибок в настройках</h2>
      <ol>
        <li><strong>Ставите 18°C, думая что &quot;охлаждает быстрее&quot;.</strong> Не быстрее — работает на 100% и опустошает кошелёк.</li>
        <li><strong>Не используете Dry при влажности.</strong> 75% влажности + 28°C ощущаются как 33°C. Dry mode решает именно это.</li>
        <li><strong>Жалюзи вниз летом.</strong> Тёплый воздух остаётся наверху, холодный собирается у ног. Ощущение охлаждения обманчиво.</li>
        <li><strong>Не используете Sleep mode ночью.</strong> Ночь на 23°C = переплата 20-30% за ноль дополнительного комфорта.</li>
        <li><strong>Включаете Turbo и забываете.</strong> Turbo — на 20-30 минут, не на 8 часов. После начального охлаждения — на 25°C.</li>
        <li><strong>Закрываете все двери.</strong> Для мульти-сплит или централи — ок. Для обычного сплита закрытая дверь = он бьётся в &quot;каменную стену&quot;.</li>
        <li><strong>Не делаете профилактику.</strong> Забитый фильтр = -25% эффективности. Даже идеальные настройки не спасут грязный аппарат.</li>
      </ol>

      <h2>Сезонная стратегия для Варны</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Сезон</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Режим</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Температура</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Заметка</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">Июнь-Август</td>
              <td className="px-4 py-3 border border-border/60">Cool</td>
              <td className="px-4 py-3 border border-border/60">25-26°C</td>
              <td className="px-4 py-3 border border-border/60">Sleep mode ночью</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Май, Сентябрь</td>
              <td className="px-4 py-3 border border-border/60">Dry или Auto</td>
              <td className="px-4 py-3 border border-border/60">24°C</td>
              <td className="px-4 py-3 border border-border/60">Влажность важнее температуры</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Октябрь</td>
              <td className="px-4 py-3 border border-border/60">Dry или Fan</td>
              <td className="px-4 py-3 border border-border/60">22°C</td>
              <td className="px-4 py-3 border border-border/60">Профилактика плесени</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Ноябрь-Март</td>
              <td className="px-4 py-3 border border-border/60">Heat</td>
              <td className="px-4 py-3 border border-border/60">20-22°C</td>
              <td className="px-4 py-3 border border-border/60">Жалюзи вниз</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Апрель</td>
              <td className="px-4 py-3 border border-border/60">Auto</td>
              <td className="px-4 py-3 border border-border/60">22°C</td>
              <td className="px-4 py-3 border border-border/60">Аппарат сам выберет режим</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Специфика Варны — что у нас иначе</h2>
      <ul>
        <li>
          <strong>Морской бриз:</strong> после обеда с моря приходит прохладный
          воздух с высокой влажностью. Часто лучше выключить кондиционер и
          открыть окна на 30-40 минут.
        </li>
        <li>
          <strong>Высокая влажность:</strong> 70-85% летом значит, что Dry mode
          почти обязателен 1-2 часа в день. Не роскошь, а профилактика плесени.
        </li>
        <li>
          <strong>Последние этажи:</strong> в Чайке, Виннице, Аспарухово —
          панельные дома с южной стороной нагреваются до 35-40°C на чердаке.
          На последнем этаже ставьте 24°C, не 25°C, плюс Eco mode.
        </li>
        <li>
          <strong>Приморские квартиры:</strong> если вы на первой линии (Галата,
          Морской сад), соль в воздухе ускоряет коррозию наружного блока. Не
          держите аппарат включённым 24/7 — давайте ему 2-3 часа отдыха в день.
        </li>
      </ul>

      <h2>Что делать прямо сейчас</h2>
      <p>
        Возьмите пульт. Поменяйте температуру с текущей на 25°C (лето) или 21°C
        (зима). Нажмите режим Cool или Heat. Нажмите Sleep, если вечер. Это весь
        &quot;апгрейд&quot;.
      </p>
      <p>
        Если несмотря на правильные настройки аппарат охлаждает хуже, чем
        раньше — почти наверняка пора на профилактику. Забитый фильтр или
        дренаж снижает эффективность на 20-30%. Запишитесь на профилактику
        через форму на сайте — обычно делаем в течение 2-3 дней.
      </p>
      <p>
        А если рассматриваете новый кондиционер — выбирайте <strong>инверторную
        модель класса А++</strong>. Разница с обычным А-классом окупается за
        2-3 сезона только на экономии электричества.
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
      <h2>Чому правильні налаштування економлять до 35% рахунку</h2>
      <p>
        Ваш кондиціонер може бути класу А++ з повною гарантією, але якщо режим
        і температура задані неправильно — рахунок за електрику буде на 25-35%
        вищий, а апарат зноситься вдвічі швидше. Це найдешевший
        &quot;апгрейд&quot;, який ви можете зробити: просто повернути 2-3
        регулятори правильно.
      </p>
      <p>
        У статті — конкретні цифри: яка температура для літа у Варні, чому режим
        Dry критичний для нашого приморського клімату, коли Sleep mode реально
        допомагає та які 7 помилок роблять майже всі користувачі.
      </p>

      <h2>П&apos;ять основних режимів — Cool, Heat, Dry, Fan, Auto</h2>
      <p>
        На пульті 5 базових режимів. Кожен — для своєї ситуації, а не &quot;для
        сильнішого охолодження&quot;.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Режим</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Що робить</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Коли вмикати</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Cool ❄️</td>
              <td className="px-4 py-3 border border-border/60">Охолоджує повітря до заданої температури</td>
              <td className="px-4 py-3 border border-border/60">Літо, надворі вище 24°C</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Heat ☀️</td>
              <td className="px-4 py-3 border border-border/60">Гріє кімнату — працює як тепловий насос</td>
              <td className="px-4 py-3 border border-border/60">Зима, надворі нижче 15°C</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Dry 💧</td>
              <td className="px-4 py-3 border border-border/60">Знижує вологість без сильного охолодження</td>
              <td className="px-4 py-3 border border-border/60">Вологі літні дні, осінні дощі</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Fan 🌀</td>
              <td className="px-4 py-3 border border-border/60">Тільки вентилює — не гріє, не охолоджує</td>
              <td className="px-4 py-3 border border-border/60">Циркуляція повітря, мінімум енергії</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Auto</td>
              <td className="px-4 py-3 border border-border/60">Апарат сам вибирає режим за температурою</td>
              <td className="px-4 py-3 border border-border/60">Міжсезоння — весна, осінь</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Ідеальна температура влітку у Варні</h2>
      <p>
        Тут помиляються понад 70% користувачів. Коли надворі 32°C — не ставте
        18°C на пульті. Кондиціонер не охолоджує &quot;швидше&quot;, він просто
        працює на 100% потужності до недосяжної цілі. Витрата електрики різко
        зростає, компресор зношується.
      </p>
      <p>
        <strong>Правильне літнє налаштування: 24-26°C</strong>
      </p>
      <ul>
        <li><strong>26°C</strong> — оптимально для вітальні, кабінету, кухні. Тіло не відчуває дискомфорту від перепаду з вулицею.</li>
        <li><strong>25°C</strong> — для кімнати з вікном на південь або захід, пряме сонце вдень.</li>
        <li><strong>24°C</strong> — для останнього поверху під дахом або якщо в кімнаті багато гостей.</li>
      </ul>
      <p>
        Різниця між 22°C та 26°C у рахунку за електрику — близько <strong>40%</strong>.
        Це реальні гроші, не теорія. Кожен градус нижче 24°C коштує додатково
        6-8% від рахунку.
      </p>

      <h3>Правило &quot;різниця 7°C&quot;</h3>
      <p>
        Здорова різниця між вулицею та кімнатою — 5-7°C. Надворі 32°C — у
        кімнаті 25-26°C. Надворі 36°C — всередині максимум 25°C. Більший розрив
        веде до застуд, скутої шиї та сухих слизових.
      </p>

      <h2>Ідеальна температура взимку</h2>
      <p>
        Кондиціонер вміє гріти — режим Heat працює як тепловий насос. Для Варни,
        де зими рідко опускаються нижче -5°C, це найдешевший спосіб обігріву
        (див. нашу статтю про обігрів кондиціонером).
      </p>
      <p>
        <strong>Правильне зимове налаштування: 20-22°C</strong>
      </p>
      <ul>
        <li><strong>22°C</strong> — вітальня, де ви проводите найбільше часу.</li>
        <li><strong>20-21°C</strong> — кабінет, кухня (там і без того тепло від готування).</li>
        <li><strong>18-19°C</strong> — спальня вночі (для кращого сну).</li>
      </ul>
      <p>
        Не ставте 26°C взимку. Це та сама помилка, що 18°C улітку — апарат
        працює на максимум, витрата злітає, а в гарячому повітрі нічим дихати.
      </p>

      <h2>Режим Dry — чому для Варни критичний</h2>
      <p>
        Варна — приморське місто. Середня літня вологість — 70-80%, восени
        доходить до 90%. Це значно вище здорової норми (40-60%). Наслідки
        надмірної вологості: плісень на стінах, пилові кліщі, &quot;старий&quot;
        запах в одязі, погана концентрація.
      </p>
      <p>
        Режим <strong>Dry (💧 крапля)</strong> створено саме для цього. Апарат
        злегка охолоджує, але основне завдання — осушення повітря через
        випарник. Витрата електрики — близько 40-50% від повного Cool.
      </p>
      <p>Коли вмикати:</p>
      <ul>
        <li>Дощові літні дні — не спекотно, але липко.</li>
        <li>Осінь (вересень-жовтень) — для профілактики плісняви.</li>
        <li>Після душу або коли сушите білизну вдома.</li>
        <li>Уранці перед роботою — короткі 30-40 хвилин для свіжого повітря.</li>
      </ul>

      <h2>Sleep mode — що він робить насправді</h2>
      <p>
        Sleep mode (Night mode) — найбільш недозрозуміла функція. Це не просто
        &quot;тихий режим&quot;. Апарат робить таке:
      </p>
      <ul>
        <li>Поступово підвищує температуру на 1-2°C за перші 2 години (улітку) або знижує (узимку) — відповідно до біоритму сну.</li>
        <li>Знижує швидкість вентилятора до мінімуму — тихий режим.</li>
        <li>Вимикає індикатори — кращі темнота.</li>
        <li>Через 7-8 годин автоматично вимикається або входить у найекономніший режим.</li>
      </ul>
      <p>
        Реальна економія в Sleep mode за ніч — <strong>20-30%</strong> проти
        звичайного Cool з фіксованою температурою. Поставте 25°C перед сном,
        натисніть Sleep — до ранку температура м&apos;яко піде до 27°C, а ви
        нічого не помітите.
      </p>

      <h2>Eco, Power, Turbo, Quiet — що вони насправді означають</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Функція</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Що робить</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Рекомендація</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Eco</td>
              <td className="px-4 py-3 border border-border/60">Обмежує потужність компресора до ~75%</td>
              <td className="px-4 py-3 border border-border/60">Вмикайте на довгі періоди (8+ годин)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Turbo / Powerful</td>
              <td className="px-4 py-3 border border-border/60">Максимум на 20-30 хв, потім звичайний режим</td>
              <td className="px-4 py-3 border border-border/60">Тільки при поверненні в розпечену квартиру</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">Quiet</td>
              <td className="px-4 py-3 border border-border/60">Знижує шум зовнішнього блоку до ~45 dB</td>
              <td className="px-4 py-3 border border-border/60">Увечері, якщо близькі сусіди</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60 font-semibold">i-Feel / Follow Me</td>
              <td className="px-4 py-3 border border-border/60">Сенсор у пульті читає температуру у вас</td>
              <td className="px-4 py-3 border border-border/60">Великі кімнати, якщо сидите далеко від блоку</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Положення вентилятора та горизонтальні жалюзі</h2>
      <p>
        Кнопка &quot;Swing&quot; запускає автоматичний рух жалюзі. Це не
        косметика — прямо впливає на розподіл повітря.
      </p>
      <ul>
        <li><strong>Літо (охолодження):</strong> жалюзі мають бути спрямовані <em>вгору</em> (горизонтально). Холодне повітря щільніше і падає вниз саме.</li>
        <li><strong>Зима (опалення):</strong> жалюзі <em>вниз</em>. Тепле повітря піднімається, інакше стеля тепла, а ноги холодні.</li>
        <li><strong>Auto Swing</strong> — нормальний компроміс, але фіксоване положення економить ще 5-8%.</li>
      </ul>

      <h2>7 найчастіших помилок у налаштуваннях</h2>
      <ol>
        <li><strong>Ставите 18°C, думаючи що &quot;охолоджує швидше&quot;.</strong> Не швидше — працює на 100% і спустошує гаманець.</li>
        <li><strong>Не використовуєте Dry при вологості.</strong> 75% вологості + 28°C відчуваються як 33°C. Dry mode розв&apos;язує саме це.</li>
        <li><strong>Жалюзі вниз улітку.</strong> Тепле повітря лишається нагорі, холодне збирається біля ніг. Відчуття охолодження оманливе.</li>
        <li><strong>Не вмикаєте Sleep mode вночі.</strong> Ніч на 23°C = переплата 20-30% за нуль додаткового комфорту.</li>
        <li><strong>Вмикаєте Turbo і забуваєте.</strong> Turbo — на 20-30 хвилин, не на 8 годин. Після початкового охолодження — на 25°C.</li>
        <li><strong>Зачиняєте всі двері.</strong> Для мульти-спліт або централі — ок. Для звичайного спліта зачинені двері = він б&apos;ється в &quot;кам&apos;яну стіну&quot;.</li>
        <li><strong>Не робите профілактику.</strong> Забитий фільтр = -25% ефективності. Навіть ідеальні налаштування не врятують брудний апарат.</li>
      </ol>

      <h2>Сезонна стратегія для Варни</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Сезон</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Режим</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Температура</th>
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Нотатка</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">Червень-Серпень</td>
              <td className="px-4 py-3 border border-border/60">Cool</td>
              <td className="px-4 py-3 border border-border/60">25-26°C</td>
              <td className="px-4 py-3 border border-border/60">Sleep mode вночі</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Травень, Вересень</td>
              <td className="px-4 py-3 border border-border/60">Dry або Auto</td>
              <td className="px-4 py-3 border border-border/60">24°C</td>
              <td className="px-4 py-3 border border-border/60">Вологість важливіша за температуру</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Жовтень</td>
              <td className="px-4 py-3 border border-border/60">Dry або Fan</td>
              <td className="px-4 py-3 border border-border/60">22°C</td>
              <td className="px-4 py-3 border border-border/60">Профілактика плісняви</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Листопад-Березень</td>
              <td className="px-4 py-3 border border-border/60">Heat</td>
              <td className="px-4 py-3 border border-border/60">20-22°C</td>
              <td className="px-4 py-3 border border-border/60">Жалюзі вниз</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Квітень</td>
              <td className="px-4 py-3 border border-border/60">Auto</td>
              <td className="px-4 py-3 border border-border/60">22°C</td>
              <td className="px-4 py-3 border border-border/60">Апарат сам вибере режим</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Специфіка Варни — що у нас інакше</h2>
      <ul>
        <li>
          <strong>Морський бриз:</strong> після обіду з моря приходить прохолодне
          повітря з високою вологістю. Часто краще вимкнути кондиціонер і
          відчинити вікна на 30-40 хвилин.
        </li>
        <li>
          <strong>Висока вологість:</strong> 70-85% улітку означає, що Dry mode
          майже обов&apos;язковий 1-2 години на день. Не розкіш, а профілактика
          плісняви.
        </li>
        <li>
          <strong>Останні поверхи:</strong> у Чайці, Винниці, Аспарухово —
          панельні будинки з південною стороною нагріваються до 35-40°C на
          горищі. На останньому поверсі ставте 24°C, не 25°C, плюс Eco mode.
        </li>
        <li>
          <strong>Приморські квартири:</strong> якщо ви на першій лінії (Галата,
          Морський сад), сіль у повітрі прискорює корозію зовнішнього блоку. Не
          тримайте апарат увімкненим 24/7 — давайте йому 2-3 години відпочинку
          на день.
        </li>
      </ul>

      <h2>Що робити зараз</h2>
      <p>
        Візьміть пульт. Поміняйте температуру з поточної на 25°C (літо) або 21°C
        (зима). Натисніть режим Cool або Heat. Натисніть Sleep, якщо вечір. Це
        весь &quot;апгрейд&quot;.
      </p>
      <p>
        Якщо попри правильні налаштування апарат охолоджує гірше, ніж раніше —
        майже напевно час на профілактику. Забитий фільтр або дренаж знижує
        ефективність на 20-30%. Запишіться на профілактику через форму на
        сайті — зазвичай робимо протягом 2-3 днів.
      </p>
      <p>
        А якщо розглядаєте новий кондиціонер — обирайте <strong>інверторну
        модель класу А++</strong>. Різниця зі звичайним А-класом окупається за
        2-3 сезони лише на економії електрики.
      </p>
    </>
  );
}

export const acCorrectSettingsGuide: BlogPost = {
  slug: "ac-correct-settings-guide",
  date: "2026-05-15",
  image: "/images/blog/ac-correct-settings-guide.jpg",
  readingTime: {
    bg: "10 мин",
    en: "10 min",
    ru: "10 мин",
    ua: "10 хв",
  },
  title: {
    bg: "Правилни настройки на климатика — режими, температури и грешките които ви струват пари",
    en: "Correct AC Settings — Modes, Temperatures and Mistakes That Cost You Money",
    ru: "Правильные настройки кондиционера — режимы, температуры и ошибки которые стоят вам денег",
    ua: "Правильні налаштування кондиціонера — режими, температури та помилки що коштують грошей",
  },
  excerpt: {
    bg: "Конкретни температури за лято и зима във Варна, кога да ползвате Dry, Sleep, Eco, Turbo и 7-те най-чести грешки на потребителите. Спестявате до 35% от сметката.",
    en: "Concrete summer/winter temperatures for Varna, when to use Dry, Sleep, Eco, Turbo modes, and the 7 most common user mistakes. Save up to 35% on your bill.",
    ru: "Конкретные температуры лета и зимы во Варне, когда использовать Dry, Sleep, Eco, Turbo и 7 самых частых ошибок пользователей. Экономия до 35% счёта.",
    ua: "Конкретні температури літа й зими у Варні, коли використовувати Dry, Sleep, Eco, Turbo і 7 найчастіших помилок користувачів. Економія до 35% рахунку.",
  },
  keywords: {
    bg: ["настройки на климатик", "температура климатик лято", "режим dry климатик", "sleep mode климатик", "икономия ток климатик Варна", "правилно ползване климатик"],
    en: ["AC settings", "air conditioner temperature summer", "AC dry mode", "AC sleep mode", "save electricity AC Varna", "how to use air conditioner correctly"],
    ru: ["настройки кондиционера", "температура кондиционера лето", "режим dry кондиционер", "sleep mode кондиционер", "экономия электричества кондиционер Варна", "как правильно пользоваться кондиционером"],
    ua: ["налаштування кондиціонера", "температура кондиціонера літо", "режим dry кондиціонер", "sleep mode кондиціонер", "економія електрики кондиціонер Варна", "як правильно користуватися кондиціонером"],
  },
  content: {
    bg: ContentBG,
    en: ContentEN,
    ru: ContentRU,
    ua: ContentUA,
  },
  faq: {
    bg: [
      { question: "Каква е идеалната температура за климатика през лятото?", answer: "25-26°C за дневна стая, 24°C за последен етаж или претъпкана стая. Разликата с външната температура трябва да е 5-7°C максимум. Никога не сваляйте на 18°C — не охлажда по-бързо." },
      { question: "Колко струва да оставя климатика на 22°C цяло лято?", answer: "С около 40% повече от 26°C. За типичен апартамент във Варна с 12000 BTU това е разлика 60-90 лв на месец. Препоръчителното е 25-26°C + Sleep mode нощем." },
      { question: "Кога да ползвам режим Dry?", answer: "При висока влажност без силна жега — характерно за Варна през май, септември и октомври. Също след баня или при простиране на дрехи вкъщи. Разходът на ток е 40-50% от пълен Cool режим." },
      { question: "Sleep mode наистина ли спестява пари?", answer: "Да, 20-30% за цяла нощ. Уредът постепенно повишава температурата с 1-2°C, намалява вентилатора и след 7-8 часа влиза в най-икономичен режим. Сложете 25°C преди лягане и натиснете Sleep." },
      { question: "Защо моят климатик не охлажда добре въпреки правилните настройки?", answer: "Най-вероятна причина: запушен филтър или нужда от профилактика. Намалява ефективността с 20-30%. Втора възможност: изтекъл фреон — изисква професионална диагностика." },
    ],
    en: [
      { question: "What's the ideal AC temperature in summer?", answer: "25-26°C for the living room, 24°C for top floor or crowded rooms. Difference with outside should be 5-7°C max. Never set 18°C — it doesn't cool faster, it just empties your wallet." },
      { question: "How much does keeping AC at 22°C all summer cost?", answer: "About 40% more than 26°C. For a typical Varna apartment with 12000 BTU that's 60-90 BGN extra per month. Recommended: 25-26°C + Sleep mode at night." },
      { question: "When should I use Dry mode?", answer: "High humidity without strong heat — typical for Varna in May, September and October. Also after showering or drying laundry indoors. Power consumption is 40-50% of full Cool mode." },
      { question: "Does Sleep mode really save money?", answer: "Yes, 20-30% per night. The unit gradually raises temperature by 1-2°C, slows the fan and after 7-8 hours enters the most economical mode. Set 25°C before bed and press Sleep." },
      { question: "Why doesn't my AC cool well despite correct settings?", answer: "Most likely cause: clogged filter or need for maintenance. Reduces efficiency by 20-30%. Second possibility: refrigerant leak — requires professional diagnosis." },
    ],
    ru: [
      { question: "Какая идеальная температура кондиционера летом?", answer: "25-26°C для гостиной, 24°C для последнего этажа или переполненной комнаты. Разница с улицей — максимум 5-7°C. Никогда не ставьте 18°C — не охлаждает быстрее, просто опустошает кошелёк." },
      { question: "Сколько стоит держать кондиционер на 22°C всё лето?", answer: "На 40% больше, чем 26°C. Для типичной квартиры во Варне с 12000 BTU это 60-90 лв доплаты в месяц. Рекомендуется: 25-26°C + Sleep mode ночью." },
      { question: "Когда использовать режим Dry?", answer: "При высокой влажности без сильной жары — типично для Варны в мае, сентябре и октябре. Также после душа или при сушке белья дома. Расход — 40-50% от полного Cool." },
      { question: "Sleep mode реально экономит деньги?", answer: "Да, 20-30% за ночь. Аппарат постепенно повышает температуру на 1-2°C, замедляет вентилятор и через 7-8 часов переходит в самый экономный режим. Поставьте 25°C перед сном и нажмите Sleep." },
      { question: "Почему мой кондиционер плохо охлаждает несмотря на правильные настройки?", answer: "Самая частая причина: забитый фильтр или нужна профилактика. Снижает эффективность на 20-30%. Вторая возможность: утечка фреона — требуется профессиональная диагностика." },
    ],
    ua: [
      { question: "Яка ідеальна температура кондиціонера влітку?", answer: "25-26°C для вітальні, 24°C для останнього поверху або переповненої кімнати. Різниця з вулицею — максимум 5-7°C. Ніколи не ставте 18°C — не охолоджує швидше, просто спустошує гаманець." },
      { question: "Скільки коштує тримати кондиціонер на 22°C усе літо?", answer: "На 40% більше, ніж 26°C. Для типової квартири у Варні з 12000 BTU це 60-90 лв доплати на місяць. Рекомендується: 25-26°C + Sleep mode уночі." },
      { question: "Коли використовувати режим Dry?", answer: "При високій вологості без сильної спеки — типово для Варни у травні, вересні та жовтні. Також після душу або при сушінні білизни вдома. Витрата — 40-50% від повного Cool." },
      { question: "Sleep mode реально економить гроші?", answer: "Так, 20-30% за ніч. Апарат поступово підвищує температуру на 1-2°C, уповільнює вентилятор і через 7-8 годин переходить у найекономніший режим. Поставте 25°C перед сном і натисніть Sleep." },
      { question: "Чому мій кондиціонер погано охолоджує попри правильні налаштування?", answer: "Найімовірніша причина: забитий фільтр або потрібна профілактика. Знижує ефективність на 20-30%. Друга можливість: витік фреону — потрібна професійна діагностика." },
    ],
  },
};
