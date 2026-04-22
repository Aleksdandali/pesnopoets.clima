import type { BlogPost } from "../types";

/* ------------------------------------------------------------------ */
/*  BG content                                                         */
/* ------------------------------------------------------------------ */
function ContentBG() {
  return (
    <>
      <h2>Какво означава &quot;стандартен монтаж&quot; на климатик</h2>
      <p>
        Всяка фирма обявява цена за &quot;стандартен монтаж&quot;, но малко хора
        знаят какво точно влиза в тази цена. Ето пълния списък на
        компонентите и работата, които трябва да получите:
      </p>
      <ul>
        <li>
          <strong>Стойка за вътрешно тяло</strong> — метална планка, която се
          монтира на стената. Вътрешният блок &quot;щраква&quot; върху нея.
          Трябва да е нивелирана перфектно, иначе кондензатът не тече правилно
          към дренажа.
        </li>
        <li>
          <strong>Стойка/конзола за външно тяло</strong> — обикновено L-образни
          метални конзоли, които се дюбелират към фасадата. Трябва да издържат
          теглото на блока плюс вибрации при работа.
        </li>
        <li>
          <strong>Медна тръба (3 метра)</strong> — две медни тръби (течна и
          газова линия) с различен диаметър, по които циркулира фреонът.
          Стандартно в цената влизат 3 метра. За повечето апартаменти обаче
          реално се изразходват 4-6 метра.
        </li>
        <li>
          <strong>Изолация</strong> — всяка медна тръба се обвива с термоизолация
          по цялата дължина. Без нея губите ефективност и рискувате образуване на
          конденз по тръбите.
        </li>
        <li>
          <strong>Дренажна тръба</strong> — отвежда кондензата (водата) от
          вътрешния блок навън. Трябва да е с наклон, за да тече гравитачно.
        </li>
        <li>
          <strong>Електрически кабел</strong> — свързва вътрешното и външното
          тяло. Захранващият кабел до контакта обикновено е включен, но ако трябва
          нова линия от таблото — това е отделно.
        </li>
        <li>
          <strong>Пробиване на стена (1 отвор)</strong> — диаметър около 65 мм,
          през който минават тръбите, дренажът и кабелът. В стандартната цена влиза
          един отвор.
        </li>
      </ul>

      <h3>Правилото за 3-те метра тръба</h3>
      <p>
        Три метра медна тръба звучи достатъчно, но в практиката рядко стигат.
        Вътрешният блок е на стената, външният — на фасадата или балкона. Между
        тях имате дебелината на стената (30-50 см при панелен блок), вертикалното
        разстояние и завоите. В типичен варненски апартамент реално отиват 4-5
        метра, а ако външният блок е на друга стена — и повече. Затова винаги
        питайте предварително колко тръба ще трябва и каква е цената за допълнителен
        метър.
      </p>

      <h3>Вакуумиране — защо е задължително</h3>
      <p>
        След свързването на тръбите системата се вакуумира с вакуум помпа.
        Целта е да се извлекат влагата и въздухът от тръбите. Ако вътре остане
        влага, тя реагира с фреона и образува киселини, които корозират
        компресора отвътре. Ако остане въздух, налягането е грешно и ефективността
        пада.
      </p>
      <p>
        Вакуумирането трябва да продължи минимум 15-20 минути. Ако техникът
        просто &quot;пусне газа&quot; без вакуум помпа — това не е правилен
        монтаж. Методът с &quot;продухване&quot; (пускане на малко фреон да
        изтласка въздуха) е остарял и вреди на системата.
      </p>

      <h3>Пускане в експлоатация</h3>
      <p>
        След вакуумирането идва финалната проверка: тест за херметичност (няма ли
        изтичане на фреон), измерване на налягането, пускане на уреда и измерване
        на температурата на изходящия въздух. Разликата между входа и изхода
        трябва да е 8-12°C. Ако всичко е наред — монтажът е завършен.
      </p>

      <h2>Цени за монтаж на климатик във Варна (2026)</h2>
      <p>
        Ето актуалните цени за стандартен монтаж. Цените включват 3 м медна
        тръба, всички фитинги, изолация, дренаж, вакуумиране и пускане.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Мощност</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Базова цена</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">До 14 000 BTU (малка стая)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">300 лв</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">До 24 000 BTU (хол, голяма стая)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">370 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">До 33 000 BTU (голямо помещение, офис)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">440 лв</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Допълнителни разходи, които могат да се появят</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Услуга</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Цена</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">Допълнителна медна тръба (на метър)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">60-80 лв/м</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Допълнително пробиване на стена</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">40 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Щробене (скриване на тръбите в стена)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">15 лв/м</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Демонтаж на стар климатик</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">80 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Достъп с кран (високи етажи)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">по запитване</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Ел. работа (нова линия от таблото)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">по запитване</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Скритите разходи, за които никой не предупреждава</h2>
      <p>
        Най-честият въпрос след монтажа е: &quot;Защо крайната сметка е по-висока
        от обявената цена?&quot; Ето къде се крият допълнителните разходи:
      </p>
      <p>
        <strong>Удължаване на медната тръба.</strong> Повечето реални монтажи
        изискват 4-6 метра, не 3. Това означава 60-240 лв допълнително. Не е
        измама — просто 3 метра покриват идеалния случай, а в реалността
        разстоянията са по-големи.
      </p>
      <p>
        <strong>Електрическа линия.</strong> Ако климатикът е по-мощен (18 000+
        BTU), вероятно ще трябва собствена линия от таблото с 16A автомат. Ако в
        апартамента няма подготвена такава — трябва електротехник, който е отделен
        разход.
      </p>
      <p>
        <strong>Разрешение от етажната собственост.</strong> В някои варненски
        блокове (особено по-новите) общото събрание изисква писмено съгласие за
        поставяне на външно тяло на фасадата. Проверете предварително, за да
        избегнете неприятности след монтажа.
      </p>
      <p>
        <strong>Кондензатна помпа.</strong> Ако дренажната тръба не може да се
        прокара с естествен наклон (например при монтаж на вътрешна стена),
        трябва кондензатна помпа. Цена: 100-150 лв за помпата плюс монтаж.
      </p>
      <p>
        <strong>Бетонни стени в панелни блокове.</strong> Пробиването на панел е
        по-бавно и по-трудно от тухла. Някои фирми начисляват допълнително за
        бетон, други — не. Питайте предварително.
      </p>
      <p>
        <strong>Сезонно натоварване.</strong> Май-август е пик сезонът за монтажи.
        Някои фирми нямат официална &quot;лятна надценка&quot;, но чакането е
        по-дълго. Ако можете, планирайте монтажа за април или септември.
      </p>
      <p>
        <strong>Нашият подход:</strong> правим оглед или уточняваме детайлите по
        телефон, и даваме фиксирана цена ПРЕДИ да започнем работа. Без изненади
        в крайната сметка.
      </p>

      <h2>Специфики на монтажа във Варна</h2>
      <p>
        Варна не е София. Климатът и сградният фонд налагат различен подход към
        монтажа.
      </p>
      <p>
        <strong>Панелни блокове.</strong> Голяма част от жилищния фонд на Варна са
        панелки от 70-те и 80-те. Стените са от армиран бетон — пробиването е
        по-бавно и изисква по-мощни инструменти. Тръбните трасета са по-дълги,
        защото вътрешните стени са дебели.
      </p>
      <p>
        <strong>Близост до морето.</strong> Ако живеете в крайбрежен квартал,
        външното тяло е изложено на солен въздух. Стандартните конзоли ръждясват
        по-бързо. Препоръчваме неръждаеми или поцинковани конзоли и антикорозийно
        покритие на корпуса.
      </p>
      <p>
        <strong>Балконен монтаж.</strong> Най-честият вариант във варненските
        апартаменти. Балконът осигурява лесен достъп за бъдещо обслужване и
        предпазва от директно слънце. Но проверете правилата на етажната
        собственост — в някои блокове има ограничения.
      </p>
      <p>
        <strong>Вятър.</strong> Варна е ветровит град, особено в крайбрежните
        квартали. Външното тяло трябва да е здраво закрепено, защото вибрациите от
        вятъра натоварват конзолите и могат да предизвикат шум.
      </p>
      <p>
        <strong>Зона на солен спрей (Чайка, Виница, Галата, Аспарухово).</strong>{" "}
        Тук корозията е най-агресивна. Освен антикорозийни конзоли, препоръчваме
        и периодична профилактика на външното тяло — измиване на кондензатора
        поне два пъти годишно.
      </p>

      <h2>Как да разпознаете качествен монтаж от лош</h2>
      <h3>Признаци за добър монтаж</h3>
      <ul>
        <li>
          <strong>Вакуум помпа</strong> — трябва да я чуете да работи 15-20
          минути. Ако техникът изобщо не е извадил такава — проблем.
        </li>
        <li>
          <strong>Изолация по цялата дължина на тръбите</strong> — от вътрешния до
          външния блок, без голи участъци.
        </li>
        <li>
          <strong>Подредено окабеляване</strong> — кабелите са фиксирани с
          кабелни превръзки, не висят свободно.
        </li>
        <li>
          <strong>Тестване на дренажа</strong> — техникът налива вода в тавата на
          вътрешния блок, за да провери дали тече правилно навън.
        </li>
        <li>
          <strong>Измерване на температурата</strong> — след пускане се проверява
          разликата вход/изход (8-12°C).
        </li>
      </ul>

      <h3>Признаци за лош монтаж</h3>
      <ul>
        <li>
          <strong>Без вакуумиране</strong> — техникът просто &quot;пуска
          газа&quot;. Това е най-честата грешка и най-вредната.
        </li>
        <li>
          <strong>Голи медни тръби</strong> — без изолация или с частична
          изолация. Губите ефективност и рискувате кондензация.
        </li>
        <li>
          <strong>Разхвърляни кабели</strong> — висящи проводници и неизолирани
          връзки говорят за небрежна работа.
        </li>
        <li>
          <strong>Дренажът не е тестван</strong> — ако не е проверен, може да
          потече вода по стената след седмица.
        </li>
        <li>
          <strong>Бързане</strong> — монтаж за под 1 час на единичен сплит е
          съмнително бърз. Нормалното време е 2-4 часа.
        </li>
      </ul>

      <h3>Последствия от лош монтаж</h3>
      <p>
        Шум и вибрации от лошо закрепено външно тяло. Изтичане на фреон от
        некачествени връзки — климатикът спира да охлажда/отоплява за месеци.
        Водни петна по стените от неправилен дренаж. И най-лошото — анулирана
        гаранция от производителя. Много хора не осъзнават, че лошият монтаж им
        струва гаранцията.
      </p>

      <h2>Чеклист след монтажа — какво да проверите</h2>
      <p>
        Преди техникът да си тръгне, проверете следните неща. Отнема 10 минути,
        но може да ви спести хиляди левове:
      </p>
      <ul>
        <li>Разликата между температурата на входящия и изходящия въздух е 8-12°C</li>
        <li>Няма капене на вода от нито една връзка</li>
        <li>Външното тяло е нивелирано и здраво закрепено</li>
        <li>Дистанционното работи, всички режими са тествани (охлаждане, отопление, вентилатор)</li>
        <li>Дренажната тръба отвежда вода свободно</li>
        <li>Техникът ви е обяснил основната експлоатация</li>
        <li>Имате гаранционна карта и фактура за монтажа</li>
        <li>Снимайте монтажа — ще ви трябва при евентуална рекламация</li>
      </ul>

      <h2>Гаранция и монтаж — връзката, която повечето хора пропускат</h2>
      <p>
        Това е може би най-важната част. Гаранцията на производителя (обикновено
        3-5 години за компресора) НЕ е безусловна. Тя изисква монтажът да е
        извършен от квалифициран техник, с правилно вакуумиране и по
        спецификациите на производителя.
      </p>
      <p>
        Ако сте наели някой &quot;на ръка&quot; и не можете да покажете фактура
        за монтаж от фирма — производителят може да откаже гаранционен ремонт.
        Видели сме случаи, в които хора плащат 800+ лв за компресор, който е
        трябвало да бъде сменен безплатно по гаранция.
      </p>
      <p>
        <strong>Нашият монтаж:</strong> идва с 12 месеца гаранция за труда и
        запазва пълната производствена гаранция. Издаваме фактура и гаранционна
        карта.
      </p>
      <p>
        <strong>Съвет:</strong> пазете фактурата за монтажа на сигурно място. Ще
        ви трябва при гаранционна рекламация. Направете и снимка на нея в
        телефона за всеки случай.
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
      <h2>What &quot;standard installation&quot; actually means</h2>
      <p>
        Every company advertises a price for &quot;standard installation,&quot;
        but few people know what that actually includes. Here is the full list
        of components and work you should receive:
      </p>
      <ul>
        <li>
          <strong>Indoor unit bracket</strong> — a metal plate mounted on the
          wall. The indoor unit clicks onto it. Must be perfectly level,
          otherwise condensate does not flow properly toward the drain.
        </li>
        <li>
          <strong>Outdoor unit bracket/console</strong> — usually L-shaped metal
          brackets bolted to the facade. Must support the unit weight plus
          vibration during operation.
        </li>
        <li>
          <strong>Copper pipe (3 meters)</strong> — two copper pipes (liquid
          and gas lines) of different diameters, carrying refrigerant between
          units. The standard price includes 3 meters. Most apartments actually
          need 4-6 meters.
        </li>
        <li>
          <strong>Insulation</strong> — every copper pipe is wrapped with thermal
          insulation along its full length. Without it, you lose efficiency and
          risk condensation forming on the pipes.
        </li>
        <li>
          <strong>Drain pipe</strong> — carries condensate (water) from the
          indoor unit outside. Must have a downward slope for gravity drainage.
        </li>
        <li>
          <strong>Electrical cable</strong> — connects the indoor and outdoor
          units. The power cable to the outlet is usually included, but if you
          need a new circuit from the breaker panel, that is separate.
        </li>
        <li>
          <strong>Wall penetration (1 hole)</strong> — approximately 65 mm
          diameter, through which pipes, drain, and cable pass. One hole is
          included in the standard price.
        </li>
      </ul>

      <h3>The 3-meter pipe rule</h3>
      <p>
        Three meters of copper pipe sounds like enough, but in practice it
        rarely is. The indoor unit sits on the wall, the outdoor unit on the
        facade or balcony. Between them you have wall thickness (30-50 cm in
        panel buildings), vertical distance, and bends. In a typical Varna
        apartment, you actually need 4-5 meters, and if the outdoor unit is on
        a different wall, even more. Always ask in advance how much pipe will
        be needed and the price per extra meter.
      </p>

      <h3>Vacuum evacuation — why it is mandatory</h3>
      <p>
        After connecting the pipes, the system must be vacuumed using a vacuum
        pump. This removes moisture and air from the lines. If moisture remains,
        it reacts with refrigerant and forms acids that corrode the compressor
        from inside. If air remains, pressure is wrong and efficiency drops.
      </p>
      <p>
        Vacuuming should last at least 15-20 minutes. If the technician simply
        &quot;releases the gas&quot; without a vacuum pump, that is not a proper
        installation. The &quot;purge&quot; method (releasing a bit of
        refrigerant to push out air) is outdated and harmful to the system.
      </p>

      <h3>Commissioning</h3>
      <p>
        After vacuuming comes the final check: leak test (no refrigerant
        escaping), pressure measurement, starting the unit, and measuring the
        outgoing air temperature. The difference between intake and output
        should be 8-12°C. If everything checks out, the installation is
        complete.
      </p>

      <h2>Installation prices in Varna (2026)</h2>
      <p>
        Current prices for standard installation. Prices include 3 m copper
        pipe, all fittings, insulation, drain, vacuum evacuation, and
        commissioning.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Capacity</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Base price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">Up to 14,000 BTU (small room)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">300 BGN</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Up to 24,000 BTU (living room)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">370 BGN</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Up to 33,000 BTU (large room/office)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">440 BGN</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Extra costs that may apply</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Service</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">Extra copper pipe (per meter)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">60-80 BGN/m</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Additional wall drilling</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">40 BGN</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Wall chasing (hiding pipes in the wall)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">15 BGN/m</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Old unit removal</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">80 BGN</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Crane access (high floors)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">by quote</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Electrical work (new circuit)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">by quote</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Hidden costs nobody tells you about</h2>
      <p>
        The most common question after installation: &quot;Why is the final
        bill higher than the advertised price?&quot; Here is where the extras
        hide:
      </p>
      <p>
        <strong>Copper pipe extension.</strong> Most real installations need
        4-6 meters, not 3. That means 60-240 BGN extra. It is not a scam —
        3 meters covers the ideal case, but real distances are longer.
      </p>
      <p>
        <strong>Electrical circuit.</strong> If your AC is 18,000+ BTU, it
        likely needs its own circuit with a 16A breaker. If your apartment does
        not have one prepared, you will need an electrician — a separate cost.
      </p>
      <p>
        <strong>Building permission.</strong> Some Varna apartment buildings
        (especially newer ones) require written approval from the homeowners
        association (HOA) for outdoor unit placement on the facade. Check
        before installation to avoid problems later.
      </p>
      <p>
        <strong>Condensate pump.</strong> If the drain pipe cannot be routed
        with a natural slope (for example, when mounting on an interior wall),
        you need a condensate pump. Cost: 100-150 BGN for the pump plus
        installation.
      </p>
      <p>
        <strong>Concrete walls in panel buildings.</strong> Drilling through
        reinforced concrete is slower and harder than brick. Some companies
        charge extra for concrete, others do not. Ask in advance.
      </p>
      <p>
        <strong>Summer rush.</strong> May through August is peak installation
        season. Some companies do not officially charge more, but wait times
        are longer. If you can, schedule for April or September.
      </p>
      <p>
        <strong>Our approach:</strong> we do a site survey or clarify details
        by phone and give you a fixed price BEFORE starting work. No surprises
        on the final bill.
      </p>

      <h2>Varna-specific installation considerations</h2>
      <p>
        Varna is not Sofia. The climate and building stock require a different
        approach to installation.
      </p>
      <p>
        <strong>Panel buildings.</strong> A large portion of Varna&apos;s
        housing stock consists of concrete panel buildings from the 1970s-80s.
        Walls are reinforced concrete — drilling is slower and requires more
        powerful tools. Pipe runs are longer because interior walls are thick.
      </p>
      <p>
        <strong>Sea proximity.</strong> If you live in a coastal neighborhood,
        the outdoor unit is exposed to salt air. Standard brackets rust faster.
        We recommend stainless or galvanized brackets and anti-corrosion
        coating on the housing.
      </p>
      <p>
        <strong>Balcony placement.</strong> The most common setup in Varna
        apartments. The balcony provides easy access for future maintenance and
        protects from direct sun. But check your building&apos;s HOA rules —
        some have restrictions.
      </p>
      <p>
        <strong>Wind load.</strong> Varna is a windy city, especially in
        coastal areas. The outdoor unit must be securely mounted because wind
        vibration stresses the brackets and can cause noise.
      </p>
      <p>
        <strong>Salt spray zone (Chayka, Vinitsa, Galata, Asparuhovo).</strong>{" "}
        Corrosion is most aggressive here. Beyond anti-corrosion brackets, we
        recommend periodic maintenance of the outdoor unit — washing the
        condenser at least twice a year.
      </p>

      <h2>How to spot quality vs bad installation</h2>
      <h3>Signs of good installation</h3>
      <ul>
        <li>
          <strong>Vacuum pump used</strong> — you should hear it running for
          15-20 minutes. If the technician never took one out, that is a
          problem.
        </li>
        <li>
          <strong>Full-length pipe insulation</strong> — from indoor to outdoor
          unit, no bare sections.
        </li>
        <li>
          <strong>Tidy cable management</strong> — cables secured with zip
          ties, not hanging loose.
        </li>
        <li>
          <strong>Drain tested</strong> — the technician pours water into the
          indoor unit tray to verify it flows properly outside.
        </li>
        <li>
          <strong>Temperature measured</strong> — after starting, the
          intake/output difference is checked (8-12°C).
        </li>
      </ul>

      <h3>Signs of bad installation</h3>
      <ul>
        <li>
          <strong>No vacuum</strong> — the technician just &quot;releases the
          gas.&quot; The most common and most damaging mistake.
        </li>
        <li>
          <strong>Bare copper pipes</strong> — no insulation or partial
          insulation. You lose efficiency and risk condensation.
        </li>
        <li>
          <strong>Messy cables</strong> — hanging wires and uninsulated
          connections mean careless work.
        </li>
        <li>
          <strong>Drain not tested</strong> — if unchecked, water may drip
          down your wall within a week.
        </li>
        <li>
          <strong>Rushed job</strong> — a single split installation in under
          1 hour is suspiciously fast. Normal time is 2-4 hours.
        </li>
      </ul>

      <h3>Consequences of bad installation</h3>
      <p>
        Noise and vibration from a poorly mounted outdoor unit. Refrigerant
        leaks from bad connections — the AC stops cooling/heating within
        months. Water stains on walls from improper drainage. And worst of
        all — voided manufacturer warranty. Many people do not realize that
        bad installation costs them their warranty coverage.
      </p>

      <h2>Post-installation checklist — what to verify</h2>
      <p>
        Before the technician leaves, check these items. Takes 10 minutes but
        can save you thousands:
      </p>
      <ul>
        <li>Temperature difference between intake and output is 8-12°C</li>
        <li>No water dripping from any connection</li>
        <li>Outdoor unit is level and securely mounted</li>
        <li>Remote control works, all modes tested (cooling, heating, fan)</li>
        <li>Drain line drains freely</li>
        <li>Installer explained basic operation</li>
        <li>You have the warranty card and installation invoice</li>
        <li>Take a photo of the installation for your records</li>
      </ul>

      <h2>Warranty and installation — the connection most people miss</h2>
      <p>
        This may be the most important part. The manufacturer warranty
        (typically 3-5 years for the compressor) is NOT unconditional. It
        requires installation by a qualified technician, with proper vacuum
        evacuation and according to manufacturer specifications.
      </p>
      <p>
        If you hired someone &quot;off the books&quot; and cannot show an
        installation invoice from a registered company, the manufacturer may
        refuse warranty repairs. We have seen cases where people paid 800+ BGN
        for a compressor that should have been replaced free under warranty.
      </p>
      <p>
        <strong>Our installation:</strong> comes with 12-month workmanship
        warranty and preserves the full manufacturer warranty. We issue an
        invoice and warranty card.
      </p>
      <p>
        <strong>Tip:</strong> keep the installation invoice in a safe place.
        You will need it for warranty claims. Also take a photo of it on your
        phone, just in case.
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
      <h2>Что означает &quot;стандартный монтаж&quot; кондиционера</h2>
      <p>
        Каждая фирма указывает цену за &quot;стандартный монтаж&quot;, но мало
        кто знает, что конкретно входит в эту цену. Вот полный список
        комплектующих и работ, которые вы должны получить:
      </p>
      <ul>
        <li>
          <strong>Крепление для внутреннего блока</strong> — металлическая
          планка, которая крепится к стене. Внутренний блок защёлкивается на неё.
          Должна быть идеально выровнена, иначе конденсат не стекает правильно в
          дренаж.
        </li>
        <li>
          <strong>Кронштейн для наружного блока</strong> — обычно L-образные
          металлические кронштейны, которые крепятся к фасаду на дюбели. Должны
          выдерживать вес блока плюс вибрацию при работе.
        </li>
        <li>
          <strong>Медная труба (3 метра)</strong> — две медные трубки (жидкостная
          и газовая линия) разного диаметра, по которым циркулирует фреон.
          Стандартно в цену входят 3 метра. Но в большинстве квартир реально
          расходуется 4-6 метров.
        </li>
        <li>
          <strong>Изоляция</strong> — каждая медная труба оборачивается
          термоизоляцией по всей длине. Без неё теряете эффективность и рискуете
          образованием конденсата на трубах.
        </li>
        <li>
          <strong>Дренажная трубка</strong> — отводит конденсат (воду) от
          внутреннего блока наружу. Должна быть с уклоном для самотёка.
        </li>
        <li>
          <strong>Электрический кабель</strong> — соединяет внутренний и наружный
          блоки. Кабель питания до розетки обычно включён, но если нужна новая
          линия от щитка — это отдельно.
        </li>
        <li>
          <strong>Отверстие в стене (1 шт.)</strong> — диаметр около 65 мм, через
          которое проходят трубы, дренаж и кабель. Одно отверстие входит в
          стандартную цену.
        </li>
      </ul>

      <h3>Правило 3 метров трубы</h3>
      <p>
        Три метра медной трубы звучит достаточно, но на практике почти никогда
        не хватает. Внутренний блок на стене, наружный — на фасаде или балконе.
        Между ними — толщина стены (30-50 см в панельных домах), перепад высот и
        повороты. В типичной варненской квартире реально уходит 4-5 метров, а
        если наружный блок на другой стене — и больше.
      </p>
      <p>
        Это важно понимать заранее. В России стандарт часто 5 метров. В Болгарии
        — 3 метра. Разница может стоить 60-160 лв дополнительно. Всегда
        уточняйте до начала работ.
      </p>

      <h3>Вакуумирование — почему это обязательно</h3>
      <p>
        После соединения труб систему вакуумируют вакуумным насосом. Цель —
        удалить влагу и воздух из трассы. Если внутри останется влага, она
        реагирует с фреоном и образует кислоты, которые разъедают компрессор
        изнутри. Если останется воздух — давление будет неправильным и
        эффективность упадёт.
      </p>
      <p>
        Вакуумирование должно длиться минимум 15-20 минут. Если мастер просто
        &quot;пустил газ&quot; без вакуумного насоса — это не правильный монтаж.
        Метод &quot;продувки&quot; (выпустить немного фреона, чтобы вытолкнуть
        воздух) устарел и вредит системе. В России этот метод тоже считается
        устаревшим, но некоторые мастера всё ещё его используют.
      </p>

      <h3>Пуско-наладка</h3>
      <p>
        После вакуумирования — финальная проверка: тест на герметичность (нет ли
        утечки фреона), измерение давления, запуск аппарата и замер температуры
        выходящего воздуха. Разница между входом и выходом должна быть 8-12°C.
        Если всё в порядке — монтаж завершён.
      </p>

      <h2>Цены на монтаж кондиционера в Варне (2026)</h2>
      <p>
        Актуальные цены на стандартный монтаж. Цены включают 3 м медной трубы,
        все фитинги, изоляцию, дренаж, вакуумирование и пуско-наладку.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Мощность</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Базовая цена</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">До 14 000 BTU (маленькая комната)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">300 лв</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">До 24 000 BTU (гостиная, большая комната)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">370 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">До 33 000 BTU (большое помещение, офис)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">440 лв</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Дополнительные расходы, которые могут возникнуть</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Услуга</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Цена</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">Дополнительная медная труба (за метр)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">60-80 лв/м</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Дополнительное отверстие в стене</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">40 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Штробление (скрытие труб в стене)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">15 лв/м</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Демонтаж старого кондиционера</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">80 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Доступ краном (высокие этажи)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">по запросу</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Электроработы (новая линия от щитка)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">по запросу</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Скрытые расходы, о которых никто не предупреждает</h2>
      <p>
        Самый частый вопрос после монтажа: &quot;Почему итоговый счёт выше
        объявленной цены?&quot; Вот где прячутся дополнительные расходы:
      </p>
      <p>
        <strong>Удлинение медной трубы.</strong> Большинство реальных монтажей
        требуют 4-6 метров, а не 3. Это 60-240 лв дополнительно. Это не обман —
        просто 3 метра покрывают идеальный случай, а в реальности расстояния
        больше.
      </p>
      <p>
        <strong>Электрическая линия.</strong> Если кондиционер мощный (18 000+
        BTU), скорее всего понадобится отдельная линия от щитка с автоматом на
        16A. Если в квартире её нет — нужен электрик, и это отдельный расход.
        В России обычно электрика делают сразу при ремонте, в Болгарии — не
        всегда.
      </p>
      <p>
        <strong>Разрешение от домоуправления.</strong> В некоторых варненских
        домах (особенно новых) общее собрание требует письменного согласия на
        установку наружного блока на фасаде. Это аналог решения ТСЖ в России.
        Проверьте заранее, чтобы не было проблем после монтажа.
      </p>
      <p>
        <strong>Конденсатный насос.</strong> Если дренажную трубку нельзя
        проложить с естественным уклоном (например, при монтаже на внутренней
        стене), нужен конденсатный насос. Цена: 100-150 лв за насос плюс монтаж.
      </p>
      <p>
        <strong>Бетонные стены в панельных домах.</strong> Сверление панели —
        это медленнее и сложнее, чем кирпич. Некоторые фирмы берут доплату за
        бетон, другие — нет. Уточняйте заранее. Если вы жили в панельном доме в
        России, принцип тот же, только стены здесь могут быть ещё толще.
      </p>
      <p>
        <strong>Сезонная загрузка.</strong> Май-август — пик сезона монтажей.
        Некоторые фирмы не ставят официальную &quot;летнюю наценку&quot;, но
        ожидание дольше. Если есть возможность, планируйте монтаж на апрель или
        сентябрь.
      </p>
      <p>
        <strong>Наш подход:</strong> делаем осмотр или уточняем детали по
        телефону и даём фиксированную цену ДО начала работ. Никаких сюрпризов в
        итоговом счёте.
      </p>

      <h2>Особенности монтажа в Варне</h2>
      <p>
        Варна — не София и не Москва. Климат и жилой фонд диктуют свои правила
        монтажа.
      </p>
      <p>
        <strong>Панельные дома.</strong> Большая часть жилого фонда Варны —
        панельки 70-80-х годов. Стены из армированного бетона — сверление
        медленнее, нужны более мощные инструменты. Трассы длиннее, потому что
        внутренние стены толстые.
      </p>
      <p>
        <strong>Близость к морю.</strong> Если живёте в прибрежном районе,
        наружный блок подвергается воздействию солёного воздуха. Стандартные
        кронштейны ржавеют быстрее. Рекомендуем нержавеющие или оцинкованные
        кронштейны и антикоррозийное покрытие корпуса.
      </p>
      <p>
        <strong>Балконный монтаж.</strong> Самый распространённый вариант в
        варненских квартирах. Балкон обеспечивает лёгкий доступ для будущего
        обслуживания и защищает от прямого солнца. Но уточните правила
        домоуправления — в некоторых домах есть ограничения.
      </p>
      <p>
        <strong>Ветровая нагрузка.</strong> Варна — ветреный город, особенно в
        прибрежных районах. Наружный блок должен быть надёжно закреплён, потому
        что ветровые вибрации нагружают кронштейны и могут вызывать шум.
      </p>
      <p>
        <strong>Зона солевого спрея (Чайка, Виница, Галата, Аспарухово).</strong>{" "}
        Здесь коррозия наиболее агрессивна. Помимо антикоррозийных кронштейнов,
        рекомендуем периодическое обслуживание наружного блока — промывка
        конденсатора минимум два раза в год.
      </p>

      <h2>Как отличить качественный монтаж от плохого</h2>
      <h3>Признаки хорошего монтажа</h3>
      <ul>
        <li>
          <strong>Вакуумный насос</strong> — вы должны слышать его работу 15-20
          минут. Если мастер его вообще не доставал — проблема.
        </li>
        <li>
          <strong>Изоляция по всей длине труб</strong> — от внутреннего до
          наружного блока, без голых участков.
        </li>
        <li>
          <strong>Аккуратная прокладка кабелей</strong> — кабели закреплены
          стяжками, не висят свободно.
        </li>
        <li>
          <strong>Тест дренажа</strong> — мастер наливает воду в поддон
          внутреннего блока, чтобы проверить, стекает ли она правильно наружу.
        </li>
        <li>
          <strong>Замер температуры</strong> — после пуска проверяется разница
          вход/выход (8-12°C).
        </li>
      </ul>

      <h3>Признаки плохого монтажа</h3>
      <ul>
        <li>
          <strong>Без вакуумирования</strong> — мастер просто &quot;пустил
          газ&quot;. Самая частая и самая вредная ошибка.
        </li>
        <li>
          <strong>Голые медные трубы</strong> — без изоляции или с частичной
          изоляцией. Теряете эффективность и рискуете образованием конденсата.
        </li>
        <li>
          <strong>Неряшливые кабели</strong> — висящие провода и неизолированные
          соединения говорят о небрежной работе.
        </li>
        <li>
          <strong>Дренаж не проверен</strong> — если не тестировали, вода может
          потечь по стене через неделю.
        </li>
        <li>
          <strong>Спешка</strong> — монтаж одного сплита меньше чем за час —
          подозрительно быстро. Нормальное время — 2-4 часа.
        </li>
      </ul>

      <h3>Последствия плохого монтажа</h3>
      <p>
        Шум и вибрация от плохо закреплённого наружного блока. Утечка фреона из
        некачественных соединений — кондиционер перестаёт охлаждать/греть за
        месяцы. Мокрые пятна на стенах от неправильного дренажа. И самое
        скверное — аннулированная гарантия производителя. Многие не осознают, что
        плохой монтаж стоит им гарантии.
      </p>

      <h2>Чек-лист после монтажа — что проверить</h2>
      <p>
        Прежде чем мастер уйдёт, проверьте следующее. Займёт 10 минут, но может
        сэкономить тысячи:
      </p>
      <ul>
        <li>Разница температур между входом и выходом — 8-12°C</li>
        <li>Нет подтёков воды ни из одного соединения</li>
        <li>Наружный блок выровнен и надёжно закреплён</li>
        <li>Пульт работает, все режимы протестированы (охлаждение, обогрев, вентилятор)</li>
        <li>Дренажная трубка отводит воду свободно</li>
        <li>Мастер объяснил базовую эксплуатацию</li>
        <li>У вас есть гарантийный талон и счёт за монтаж</li>
        <li>Сфотографируйте монтаж — пригодится при возможной рекламации</li>
      </ul>

      <h2>Гарантия и монтаж — связь, которую большинство упускает</h2>
      <p>
        Это, пожалуй, самая важная часть. Гарантия производителя (обычно 3-5 лет
        на компрессор) — НЕ безусловная. Она требует, чтобы монтаж был выполнен
        квалифицированным специалистом, с правильным вакуумированием и по
        спецификациям производителя.
      </p>
      <p>
        Если вы наняли кого-то &quot;по знакомству&quot; и не можете предъявить
        счёт за монтаж от фирмы — производитель может отказать в гарантийном
        ремонте. Мы видели случаи, когда люди платили 800+ лв за компрессор,
        который должны были заменить бесплатно по гарантии. Это отличается от
        практики в России, где гарантийные правила иногда трактуются мягче.
      </p>
      <p>
        <strong>Наш монтаж:</strong> включает 12 месяцев гарантии на работу и
        сохраняет полную заводскую гарантию. Выдаём счёт и гарантийный талон.
      </p>
      <p>
        <strong>Совет:</strong> храните счёт за монтаж в надёжном месте. Он
        понадобится при гарантийном обращении. Сделайте также фото на телефон —
        на всякий случай.
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
      <h2>Що означає &quot;стандартний монтаж&quot; кондиціонера</h2>
      <p>
        Кожна фірма вказує ціну за &quot;стандартний монтаж&quot;, але мало хто
        знає, що саме входить у цю ціну. Ось повний перелік комплектуючих і
        робіт, які ви маєте отримати:
      </p>
      <ul>
        <li>
          <strong>Кріплення для внутрішнього блоку</strong> — металева планка,
          яка кріпиться до стіни. Внутрішній блок клацає на неї. Повинна бути
          ідеально вирівняна, інакше конденсат не стікатиме правильно у дренаж.
        </li>
        <li>
          <strong>Кронштейн для зовнішнього блоку</strong> — зазвичай L-подібні
          металеві кронштейни, які кріпляться до фасаду на дюбелі. Повинні
          витримувати вагу блоку плюс вібрацію під час роботи.
        </li>
        <li>
          <strong>Мідна труба (3 метри)</strong> — дві мідні трубки (рідинна та
          газова лінії) різного діаметра, по яких циркулює фреон. Стандартно в
          ціну входять 3 метри. Але в більшості квартир реально витрачається 4-6
          метрів.
        </li>
        <li>
          <strong>Ізоляція</strong> — кожна мідна труба обгортається
          теплоізоляцією по всій довжині. Без неї втрачаєте ефективність і
          ризикуєте утворенням конденсату на трубах.
        </li>
        <li>
          <strong>Дренажна трубка</strong> — відводить конденсат (воду) від
          внутрішнього блоку назовні. Повинна мати нахил для самопливу.
        </li>
        <li>
          <strong>Електричний кабель</strong> — з&apos;єднує внутрішній і
          зовнішній блоки. Кабель живлення до розетки зазвичай включений, але
          якщо потрібна нова лінія від щитка — це окремо.
        </li>
        <li>
          <strong>Отвір у стіні (1 шт.)</strong> — діаметр близько 65 мм, через
          який проходять труби, дренаж і кабель. Один отвір входить у стандартну
          ціну.
        </li>
      </ul>

      <h3>Правило 3 метрів труби</h3>
      <p>
        Три метри мідної труби звучить достатньо, але на практиці майже ніколи не
        вистачає. Внутрішній блок на стіні, зовнішній — на фасаді або балконі.
        Між ними — товщина стіни (30-50 см у панельних будинках), перепад висот і
        повороти. У типовій варненській квартирі реально йде 4-5 метрів, а якщо
        зовнішній блок на іншій стіні — і більше.
      </p>
      <p>
        Це важливо розуміти заздалегідь. В Україні стандарт часто 5 метрів. У
        Болгарії — 3 метри. Різниця може коштувати 60-160 лв додатково. Завжди
        уточнюйте до початку робіт.
      </p>

      <h3>Вакуумування — чому це обов&apos;язково</h3>
      <p>
        Після з&apos;єднання труб систему вакуумують вакуумним насосом. Мета —
        видалити вологу та повітря з траси. Якщо всередині залишиться волога,
        вона реагує з фреоном і утворює кислоти, які роз&apos;їдають компресор
        зсередини. Якщо залишиться повітря — тиск буде неправильним і
        ефективність впаде.
      </p>
      <p>
        Вакуумування має тривати мінімум 15-20 хвилин. Якщо майстер просто
        &quot;пустив газ&quot; без вакуумного насоса — це не правильний монтаж.
        Метод &quot;продувки&quot; (випустити трохи фреону, щоб витиснути
        повітря) застарілий і шкодить системі.
      </p>

      <h3>Пуско-налагодження</h3>
      <p>
        Після вакуумування — фінальна перевірка: тест на герметичність (чи немає
        витоку фреону), вимірювання тиску, запуск апарата і замір температури
        повітря на виході. Різниця між входом і виходом повинна бути 8-12°C. Якщо
        все гаразд — монтаж завершено.
      </p>

      <h2>Ціни на монтаж кондиціонера у Варні (2026)</h2>
      <p>
        Актуальні ціни на стандартний монтаж. Ціни включають 3 м мідної труби,
        всі фітинги, ізоляцію, дренаж, вакуумування та пуско-налагодження.
      </p>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Потужність</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Базова ціна</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">До 14 000 BTU (мала кімната)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">300 лв (~4300 грн)</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">До 24 000 BTU (вітальня, велика кімната)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">370 лв (~5300 грн)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">До 33 000 BTU (велике приміщення, офіс)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">440 лв (~6300 грн)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Додаткові витрати, які можуть виникнути</h3>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-4 py-3 font-semibold border border-border/60">Послуга</th>
              <th className="text-right px-4 py-3 font-semibold border border-border/60">Ціна</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-3 border border-border/60">Додаткова мідна труба (за метр)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">60-80 лв/м</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Додатковий отвір у стіні</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">40 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Штробління (приховування труб у стіні)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">15 лв/м</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Демонтаж старого кондиціонера</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">80 лв</td>
            </tr>
            <tr>
              <td className="px-4 py-3 border border-border/60">Доступ краном (високі поверхи)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">за запитом</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="px-4 py-3 border border-border/60">Електроробота (нова лінія від щитка)</td>
              <td className="text-right px-4 py-3 border border-border/60 font-semibold">за запитом</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Приховані витрати, про які ніхто не попереджає</h2>
      <p>
        Найчастіше запитання після монтажу: &quot;Чому кінцевий рахунок вищий за
        оголошену ціну?&quot; Ось де ховаються додаткові витрати:
      </p>
      <p>
        <strong>Подовження мідної труби.</strong> Більшість реальних монтажів
        потребують 4-6 метрів, а не 3. Це 60-240 лв додатково. Це не обман —
        просто 3 метри покривають ідеальний випадок, а в реальності відстані
        більші.
      </p>
      <p>
        <strong>Електрична лінія.</strong> Якщо кондиціонер потужний (18 000+
        BTU), ймовірно знадобиться окрема лінія від щитка з автоматом на 16A.
        Якщо в квартирі її немає — потрібен електрик, і це окремий витрат. В
        Україні зазвичай електрику роблять одразу під час ремонту, в Болгарії —
        не завжди.
      </p>
      <p>
        <strong>Дозвіл від домоуправління.</strong> В деяких варненських будинках
        (особливо нових) загальні збори вимагають письмової згоди на встановлення
        зовнішнього блоку на фасаді. Це аналог рішення ОСББ в Україні.
        Перевірте заздалегідь, щоб не було проблем після монтажу.
      </p>
      <p>
        <strong>Конденсатний насос.</strong> Якщо дренажну трубку не можна
        прокласти з природним нахилом (наприклад, при монтажі на внутрішній
        стіні), потрібен конденсатний насос. Ціна: 100-150 лв за насос плюс
        монтаж.
      </p>
      <p>
        <strong>Бетонні стіни в панельних будинках.</strong> Свердління панелі —
        це повільніше і складніше, ніж цегла. Деякі фірми беруть доплату за
        бетон, інші — ні. Уточнюйте заздалегідь.
      </p>
      <p>
        <strong>Сезонне навантаження.</strong> Травень-серпень — пік сезону
        монтажів. Деякі фірми не ставлять офіційну &quot;літню націнку&quot;, але
        очікування довше. Якщо є можливість, плануйте монтаж на квітень або
        вересень.
      </p>
      <p>
        <strong>Наш підхід:</strong> робимо огляд або уточнюємо деталі по
        телефону і даємо фіксовану ціну ДО початку робіт. Жодних сюрпризів у
        кінцевому рахунку.
      </p>

      <h2>Особливості монтажу у Варні</h2>
      <p>
        Варна — не Софія і не Київ. Клімат та житловий фонд диктують свої
        правила монтажу.
      </p>
      <p>
        <strong>Панельні будинки.</strong> Значна частина житлового фонду Варни —
        панельки 70-80-х років. Стіни з армованого бетону — свердління
        повільніше, потрібні потужніші інструменти. Траси довші, бо внутрішні
        стіни товсті.
      </p>
      <p>
        <strong>Близькість до моря.</strong> Якщо живете в прибережному районі,
        зовнішній блок піддається впливу солоного повітря. Стандартні кронштейни
        іржавіють швидше. Рекомендуємо нержавіючі або оцинковані кронштейни та
        антикорозійне покриття корпусу.
      </p>
      <p>
        <strong>Балконний монтаж.</strong> Найпоширеніший варіант у варненських
        квартирах. Балкон забезпечує легкий доступ для майбутнього обслуговування
        і захищає від прямого сонця. Але уточніть правила домоуправління — в
        деяких будинках є обмеження.
      </p>
      <p>
        <strong>Вітрове навантаження.</strong> Варна — вітряне місто, особливо в
        прибережних районах. Зовнішній блок повинен бути надійно закріплений, бо
        вітрові вібрації навантажують кронштейни і можуть спричинити шум.
      </p>
      <p>
        <strong>Зона сольового спрею (Чайка, Віниця, Галата, Аспарухово).</strong>{" "}
        Тут корозія найагресивніша. Окрім антикорозійних кронштейнів, рекомендуємо
        періодичне обслуговування зовнішнього блоку — промивання конденсатора
        мінімум двічі на рік.
      </p>

      <h2>Як відрізнити якісний монтаж від поганого</h2>
      <h3>Ознаки якісного монтажу</h3>
      <ul>
        <li>
          <strong>Вакуумний насос</strong> — ви повинні чути його роботу 15-20
          хвилин. Якщо майстер його взагалі не діставав — проблема.
        </li>
        <li>
          <strong>Ізоляція по всій довжині труб</strong> — від внутрішнього до
          зовнішнього блоку, без голих ділянок.
        </li>
        <li>
          <strong>Акуратне прокладання кабелів</strong> — кабелі закріплені
          стяжками, не висять вільно.
        </li>
        <li>
          <strong>Тест дренажу</strong> — майстер наливає воду в піддон
          внутрішнього блоку, щоб перевірити, чи стікає вона правильно назовні.
        </li>
        <li>
          <strong>Замір температури</strong> — після пуску перевіряється різниця
          вхід/вихід (8-12°C).
        </li>
      </ul>

      <h3>Ознаки поганого монтажу</h3>
      <ul>
        <li>
          <strong>Без вакуумування</strong> — майстер просто &quot;пустив
          газ&quot;. Найчастіша і найшкідливіша помилка.
        </li>
        <li>
          <strong>Голі мідні труби</strong> — без ізоляції або з частковою
          ізоляцією. Втрачаєте ефективність і ризикуєте утворенням конденсату.
        </li>
        <li>
          <strong>Неохайні кабелі</strong> — висячі дроти та неізольовані
          з&apos;єднання говорять про недбалу роботу.
        </li>
        <li>
          <strong>Дренаж не перевірений</strong> — якщо не тестували, вода може
          потекти по стіні через тиждень.
        </li>
        <li>
          <strong>Поспіх</strong> — монтаж одного спліта менше ніж за годину —
          підозріло швидко. Нормальний час — 2-4 години.
        </li>
      </ul>

      <h3>Наслідки поганого монтажу</h3>
      <p>
        Шум і вібрація від погано закріпленого зовнішнього блоку. Витік фреону
        з неякісних з&apos;єднань — кондиціонер перестає охолоджувати/гріти за
        місяці. Мокрі плями на стінах від неправильного дренажу. І найгірше —
        анульована гарантія виробника. Багато людей не усвідомлюють, що поганий
        монтаж коштує їм гарантії.
      </p>

      <h2>Чек-лист після монтажу — що перевірити</h2>
      <p>
        Перш ніж майстер піде, перевірте наступне. Займе 10 хвилин, але може
        зекономити тисячі:
      </p>
      <ul>
        <li>Різниця температур між входом і виходом — 8-12°C</li>
        <li>Немає підтікань води з жодного з&apos;єднання</li>
        <li>Зовнішній блок вирівняний і надійно закріплений</li>
        <li>Пульт працює, всі режими протестовані (охолодження, обігрів, вентилятор)</li>
        <li>Дренажна трубка відводить воду вільно</li>
        <li>Майстер пояснив базову експлуатацію</li>
        <li>У вас є гарантійний талон і рахунок за монтаж</li>
        <li>Сфотографуйте монтаж — знадобиться при можливій рекламації</li>
      </ul>

      <h2>Гарантія та монтаж — зв&apos;язок, який більшість пропускає</h2>
      <p>
        Це, мабуть, найважливіша частина. Гарантія виробника (зазвичай 3-5 років
        на компресор) — НЕ безумовна. Вона вимагає, щоб монтаж був виконаний
        кваліфікованим фахівцем, з правильним вакуумуванням і за специфікаціями
        виробника.
      </p>
      <p>
        Якщо ви найняли когось &quot;по знайомству&quot; і не можете показати
        рахунок за монтаж від фірми — виробник може відмовити в гарантійному
        ремонті. Ми бачили випадки, коли люди платили 800+ лв за компресор, який
        мали замінити безкоштовно за гарантією. В Україні правила ОСББ та
        гарантійні умови відрізняються від болгарських — тут суворіше ставляться
        до документів.
      </p>
      <p>
        <strong>Наш монтаж:</strong> включає 12 місяців гарантії на роботу і
        зберігає повну заводську гарантію. Видаємо рахунок та гарантійний талон.
      </p>
      <p>
        <strong>Порада:</strong> зберігайте рахунок за монтаж у надійному місці.
        Він знадобиться при гарантійному зверненні. Зробіть також фото на
        телефон — про всяк випадок.
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Post definition                                                    */
/* ------------------------------------------------------------------ */
export const installationCostsVarna: BlogPost = {
  slug: "installation-costs-varna",
  date: "2026-04-22",
  image: "/images/blog/installation-costs-varna.jpg",
  readingTime: {
    bg: "12 мин",
    en: "12 min",
    ru: "12 мин",
    ua: "12 хв",
  },
  title: {
    bg: "Монтаж на климатик — цени, какво включва и как да не надплатите",
    en: "AC Installation — Prices, What's Included, and How Not to Overpay",
    ru: "Монтаж кондиционера — цены, что включено и как не переплатить",
    ua: "Монтаж кондиціонера — ціни, що включено та як не переплатити",
  },
  excerpt: {
    bg: "Какво влиза в стандартния монтаж, колко струва във Варна, скрити разходи и как да разпознаете качествена работа от халтура. Реални цени, чеклист и гаранционни тънкости.",
    en: "What standard installation includes, how much it costs in Varna, hidden costs, and how to tell quality work from a bad job. Real prices, checklist, and warranty details.",
    ru: "Что входит в стандартный монтаж, сколько стоит в Варне, скрытые расходы и как отличить качественную работу от халтуры. Реальные цены, чек-лист и гарантийные тонкости.",
    ua: "Що входить у стандартний монтаж, скільки коштує у Варні, приховані витрати та як відрізнити якісну роботу від халтури. Реальні ціни, чек-лист та гарантійні тонкощі.",
  },
  keywords: {
    bg: ["монтаж климатик Варна", "монтаж климатик цена", "инсталация климатик Варна", "монтаж сплит система", "цена монтаж климатик 2026"],
    en: ["AC installation Varna", "air conditioner installation cost", "AC installation price Bulgaria", "split system installation Varna", "AC mounting cost"],
    ru: ["монтаж кондиционера Варна", "установка кондиционера цена", "монтаж сплит системы Варна", "стоимость установки кондиционера", "монтаж кондиционера цена 2026"],
    ua: ["монтаж кондиціонера Варна", "встановлення кондиціонера ціна", "монтаж спліт системи Варна", "вартість монтажу кондиціонера", "монтаж кондиціонера ціна 2026"],
  },
  content: {
    bg: ContentBG,
    en: ContentEN,
    ru: ContentRU,
    ua: ContentUA,
  },
  faq: {
    bg: [
      { question: "Колко струва стандартен монтаж на климатик във Варна?", answer: "300-440 лв в зависимост от мощността (BTU). Цената включва 3 м медна тръба, всички материали, вакуумиране и пускане в експлоатация." },
      { question: "Какви скрити разходи да очаквам?", answer: "Най-честите: допълнителна тръба (60-80 лв/м), пробиване на стена (40 лв), демонтаж на стар уред (80 лв). Повечето монтажи изискват 4-6 м тръба вместо стандартните 3 м." },
      { question: "Колко време отнема монтажът?", answer: "Стандартен монтаж: 2-4 часа. Предлагаме и монтаж в същия ден при наличност." },
      { question: "Лошият монтаж анулира ли гаранцията?", answer: "Да. Производителите изискват професионален монтаж с вакуумиране за валидна гаранция. Пазете фактурата за монтажа." },
      { question: "Трябва ли разрешение от етажната собственост за монтаж?", answer: "В някои варненски блокове — да, необходимо е съгласие от общото събрание за поставяне на външно тяло на фасадата. Можем да ви консултираме." },
    ],
    en: [
      { question: "How much does standard AC installation cost in Varna?", answer: "300-440 BGN depending on BTU capacity. The price includes 3 m copper pipe, all materials, vacuum evacuation, and commissioning." },
      { question: "What hidden costs should I expect?", answer: "Most common: extra pipe (60-80 BGN/m), wall drilling (40 BGN), old unit removal (80 BGN). Most installations need 4-6 m of pipe instead of the standard 3 m." },
      { question: "How long does installation take?", answer: "Standard installation: 2-4 hours. Same-day service available." },
      { question: "Does bad installation void warranty?", answer: "Yes. Manufacturers require professional installation with vacuum evacuation for warranty coverage. Keep your installation invoice." },
      { question: "Do I need permission from the building to install AC?", answer: "Some Varna apartment buildings require HOA approval for outdoor unit placement on the facade. We can advise on your specific situation." },
    ],
    ru: [
      { question: "Сколько стоит стандартный монтаж кондиционера в Варне?", answer: "300-440 лв в зависимости от мощности (BTU). Цена включает 3 м медной трубы, все материалы, вакуумирование и пуско-наладку." },
      { question: "Какие скрытые расходы ожидать?", answer: "Самые частые: дополнительная труба (60-80 лв/м), сверление стены (40 лв), демонтаж старого аппарата (80 лв). Большинство монтажей требуют 4-6 м трубы вместо стандартных 3 м." },
      { question: "Сколько времени занимает монтаж?", answer: "Стандартный монтаж: 2-4 часа. Возможен монтаж в тот же день при наличии." },
      { question: "Плохой монтаж аннулирует гарантию?", answer: "Да. Производители требуют профессиональный монтаж с вакуумированием для действия гарантии. Сохраняйте счёт за монтаж." },
      { question: "Нужно ли разрешение от домоуправления для установки?", answer: "В некоторых варненских домах — да, требуется согласие общего собрания на размещение наружного блока на фасаде. Аналог решения ТСЖ. Мы можем проконсультировать." },
    ],
    ua: [
      { question: "Скільки коштує стандартний монтаж кондиціонера у Варні?", answer: "300-440 лв (~4300-6300 грн) залежно від потужності (BTU). Ціна включає 3 м мідної труби, всі матеріали, вакуумування та пуско-налагодження." },
      { question: "Які приховані витрати очікувати?", answer: "Найчастіші: додаткова труба (60-80 лв/м), свердління стіни (40 лв), демонтаж старого апарата (80 лв). Більшість монтажів потребують 4-6 м труби замість стандартних 3 м." },
      { question: "Скільки часу займає монтаж?", answer: "Стандартний монтаж: 2-4 години. Можливий монтаж того ж дня за наявності." },
      { question: "Поганий монтаж анулює гарантію?", answer: "Так. Виробники вимагають професійний монтаж з вакуумуванням для дії гарантії. Зберігайте рахунок за монтаж." },
      { question: "Чи потрібен дозвіл від домоуправління для встановлення?", answer: "В деяких варненських будинках — так, потрібна згода загальних зборів на розміщення зовнішнього блоку на фасаді. Це аналог рішення ОСББ. Ми можемо проконсультувати." },
    ],
  },
};
