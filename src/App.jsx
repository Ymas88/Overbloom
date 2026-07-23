import { useEffect, useRef, useState } from 'react'
import { getSubjects, addSubject } from './storage/subjects'
import { getSessions } from './storage/sessions'
import { getHarvests, setHarvestedAt } from './storage/harvests'
import { getCurrency, addCurrency } from './storage/currency'
import { getLootBoxCount, addLootBox, removeLootBox } from './storage/lootboxes'
import { getSeeds, addSeed } from './storage/seeds'
import { getSubjectCrops, setSubjectCrop } from './storage/subjectCrops'
import { getSwordBoxCount, addSwordBox, removeSwordBox } from './storage/swordboxes'
import { getSwords, addSword } from './storage/swords'
import { getEquippedSword, setEquippedSword } from './storage/equippedSword'
import { getHealth, setHealth, MAX_HEALTH } from './storage/health'
import { getClaimedQuests, claimQuest } from './storage/quests'
import { LOOT_BOX_PRICE, SWORD_BOX_PRICE } from './game/shop'
import { drawRandomCrop, getCropOrDefault, RARITIES } from './game/crops'
import { drawRandomSword, SWORD_RARITIES, getSword } from './game/swords'
import { generateQuestion } from './game/mathQuiz'
import { getQuestStatus, QUEST_REWARD } from './game/quests'
import FarmCanvas from './components/FarmCanvas'
import FarmhousePanel from './components/FarmhousePanel'
import PlotPanel from './components/PlotPanel'
import InventoryPanel from './components/InventoryPanel'
import ShopPanel from './components/ShopPanel'
import LootRevealPanel from './components/LootRevealPanel'
import MathQuizPanel from './components/MathQuizPanel'
import QuestBoardPanel from './components/QuestBoardPanel'
import CodexPanel from './components/CodexPanel'
import StatsPanel from './components/StatsPanel'

function App() {
  const [subjects, setSubjects] = useState([])
  const [sessions, setSessions] = useState([])
  const [harvests, setHarvests] = useState({})
  const [currency, setCurrency] = useState(0)
  const [lootBoxes, setLootBoxes] = useState(0)
  const [seeds, setSeeds] = useState({})
  const [subjectCrops, setSubjectCrops] = useState({})
  const [swordBoxes, setSwordBoxes] = useState(0)
  const [ownedSwords, setOwnedSwords] = useState({})
  const [equippedSwordId, setEquippedSwordId] = useState(null)
  const [reveal, setReveal] = useState(null) // {kind:'crop'|'sword', id, name, rarity}
  const [harvestSignal, setHarvestSignal] = useState(0)
  const [health, setHealthState] = useState(MAX_HEALTH)
  const [quiz, setQuiz] = useState(null)
  const [claimedQuests, setClaimedQuests] = useState([])
  const [biomeBanner, setBiomeBanner] = useState(null)
  const biomeBannerTimeoutRef = useRef(null)
  const [interaction, setInteraction] = useState(null) // null | {type:'farmhouse'} | {type:'plot', subjectId} | {type:'shop'} | {type:'inventory'}

  useEffect(() => {
    setSubjects(getSubjects())
    setSessions(getSessions())
    setHarvests(getHarvests())
    setCurrency(getCurrency())
    setLootBoxes(getLootBoxCount())
    setSeeds(getSeeds())
    setSubjectCrops(getSubjectCrops())
    setSwordBoxes(getSwordBoxCount())
    setOwnedSwords(getSwords())
    setEquippedSwordId(getEquippedSword())
    setHealthState(getHealth())
    setClaimedQuests(getClaimedQuests())
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (quiz) return
      if (e.key === 'Escape' && reveal) setReveal(null)
      else if (e.key === 'Escape' && interaction) setInteraction(null)
      if ((e.key === 'i' || e.key === 'I') && !interaction && !reveal) setInteraction({ type: 'inventory' })
      if ((e.key === 'c' || e.key === 'C') && !interaction && !reveal) setInteraction({ type: 'codex' })
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [interaction, reveal, quiz])

  function handleAddSubject(name) {
    setSubjects(addSubject(name))
  }

  function handleSessionSaved() {
    setSessions(getSessions())
  }

  function handleHarvest(subjectId) {
    const crop = getCropOrDefault(subjectCrops[subjectId] ?? null)
    const reward = RARITIES[crop.rarity].reward
    setCurrency(addCurrency(reward))
    setHarvests(setHarvestedAt(subjectId, Date.now()))
    setHarvestSignal((n) => n + 1)
    setInteraction(null)
  }

  function handleSlimeHit() {
    if (quiz) return
    setQuiz(generateQuestion())
  }

  function handleBiomeChange(name) {
    setBiomeBanner(name)
    if (biomeBannerTimeoutRef.current) clearTimeout(biomeBannerTimeoutRef.current)
    biomeBannerTimeoutRef.current = setTimeout(() => setBiomeBanner(null), 3000)
  }

  function handleQuizAnswer(correct) {
    if (correct) {
      setCurrency(addCurrency(1))
    } else {
      setHealthState(setHealth(health - 1))
    }
    setQuiz(null)
  }

  function handleClaimQuest(questId) {
    setCurrency(addCurrency(QUEST_REWARD))
    setClaimedQuests(claimQuest(questId))
  }

  function handleBuyLootBox() {
    if (currency < LOOT_BOX_PRICE) return
    setCurrency(addCurrency(-LOOT_BOX_PRICE))
    setLootBoxes(addLootBox())
  }

  function handleOpenLootBox() {
    if (lootBoxes < 1) return
    const crop = drawRandomCrop()
    setLootBoxes(removeLootBox())
    setSeeds(addSeed(crop.id))
    setInteraction(null)
    setReveal({ kind: 'crop', ...crop })
  }

  function handleBuySwordBox() {
    if (currency < SWORD_BOX_PRICE) return
    setCurrency(addCurrency(-SWORD_BOX_PRICE))
    setSwordBoxes(addSwordBox())
  }

  function handleOpenSwordBox() {
    if (swordBoxes < 1) return
    const sword = drawRandomSword()
    setSwordBoxes(removeSwordBox())
    setOwnedSwords(addSword(sword.id))
    setInteraction(null)
    setReveal({ kind: 'sword', ...sword })
  }

  function handleBuySword(swordId, price) {
    if (currency < price) return
    setCurrency(addCurrency(-price))
    setOwnedSwords(addSword(swordId))
  }

  function handleEquipSword(swordId) {
    setEquippedSwordId(setEquippedSword(swordId))
  }

  function handleAssignCrop(subjectId, cropId) {
    setSubjectCrops(setSubjectCrop(subjectId, cropId))
  }

  function closePanel() {
    setInteraction(null)
  }

  const activePlotSubject =
    interaction?.type === 'plot' ? subjects.find((s) => s.id === interaction.subjectId) : null

  return (
    <div className="game-screen">
      <FarmCanvas
        subjects={subjects}
        sessions={sessions}
        harvests={harvests}
        subjectCrops={subjectCrops}
        paused={interaction !== null || reveal !== null || quiz !== null}
        harvestSignal={harvestSignal}
        equippedSwordId={equippedSwordId}
        onInteract={setInteraction}
        onSlimeHit={handleSlimeHit}
        onBiomeChange={handleBiomeChange}
      />

      {biomeBanner && (
        <div className="biome-banner" key={biomeBanner}>
          {biomeBanner}
        </div>
      )}

      <div className="hud-coins">{currency} coins</div>
      <div className="hud-health">
        <div className="hud-health-bar" style={{ width: `${(health / MAX_HEALTH) * 100}%` }} />
        <span className="hud-health-label">{health}/{MAX_HEALTH} HP</span>
      </div>
      <button className="hud-stats-button" onClick={() => setInteraction({ type: 'stats' })}>
        Stats
      </button>

      <div className="hud-hotbar">
        <div
          className={`inventory-slot${equippedSwordId ? '' : ' empty'}`}
          title={equippedSwordId ? getSword(equippedSwordId)?.name : 'No sword equipped'}
        >
          {equippedSwordId && (
            <img src={`/sprites/swords/${equippedSwordId}.png`} alt="" className="inventory-slot-icon" />
          )}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="inventory-slot empty" title="Empty — reserved for a future item" />
        ))}
      </div>

      {quiz && <MathQuizPanel question={quiz} onAnswer={handleQuizAnswer} />}

      {interaction?.type === 'codex' && <CodexPanel onClose={closePanel} />}

      {interaction?.type === 'stats' && <StatsPanel sessions={sessions} onClose={closePanel} />}

      {interaction?.type === 'questBoard' && (
        <QuestBoardPanel
          quests={getQuestStatus(sessions, harvests, claimedQuests)}
          onClaim={handleClaimQuest}
          onClose={closePanel}
        />
      )}

      {interaction?.type === 'inventory' && (
        <InventoryPanel
          currency={currency}
          lootBoxes={lootBoxes}
          seeds={seeds}
          swordBoxes={swordBoxes}
          ownedSwords={ownedSwords}
          equippedSwordId={equippedSwordId}
          onOpenLootBox={handleOpenLootBox}
          onOpenSwordBox={handleOpenSwordBox}
          onEquipSword={handleEquipSword}
          onClose={closePanel}
        />
      )}

      {reveal && (
        <LootRevealPanel
          title={reveal.kind === 'sword' ? 'Swordbox Opened!' : 'Seedbox Opened!'}
          iconSrc={`/sprites/${reveal.kind === 'sword' ? 'swords' : 'crops'}/${reveal.id}.png`}
          name={reveal.name}
          rarityLabel={
            reveal.kind === 'sword' ? SWORD_RARITIES[reveal.rarity].label : RARITIES[reveal.rarity].label
          }
          onClose={() => setReveal(null)}
        />
      )}

      {interaction?.type === 'shop' && (
        <ShopPanel
          currency={currency}
          onBuyLootBox={handleBuyLootBox}
          onBuySwordBox={handleBuySwordBox}
          onBuySword={handleBuySword}
          onClose={closePanel}
        />
      )}

      {interaction?.type === 'farmhouse' && (
        <FarmhousePanel
          subjects={subjects}
          sessions={sessions}
          currency={currency}
          seeds={seeds}
          subjectCrops={subjectCrops}
          onAddSubject={handleAddSubject}
          onAssignCrop={handleAssignCrop}
          onSessionSaved={handleSessionSaved}
          onClose={closePanel}
        />
      )}

      {activePlotSubject && (
        <PlotPanel
          subject={activePlotSubject}
          sessions={sessions}
          harvestedAt={harvests[activePlotSubject.id] ?? 0}
          cropId={subjectCrops[activePlotSubject.id] ?? null}
          onSessionSaved={handleSessionSaved}
          onHarvest={handleHarvest}
          onClose={closePanel}
        />
      )}
    </div>
  )
}

export default App
