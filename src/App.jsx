import { useEffect, useState } from 'react'
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
import { LOOT_BOX_PRICE, SWORD_BOX_PRICE } from './game/shop'
import { drawRandomCrop, getCropOrDefault, RARITIES } from './game/crops'
import { drawRandomSword, SWORD_RARITIES } from './game/swords'
import FarmCanvas from './components/FarmCanvas'
import FarmhousePanel from './components/FarmhousePanel'
import PlotPanel from './components/PlotPanel'
import InventoryPanel from './components/InventoryPanel'
import ShopPanel from './components/ShopPanel'
import LootRevealPanel from './components/LootRevealPanel'

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
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && reveal) setReveal(null)
      else if (e.key === 'Escape' && interaction) setInteraction(null)
      if ((e.key === 'i' || e.key === 'I') && !interaction && !reveal) setInteraction({ type: 'inventory' })
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [interaction, reveal])

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
        paused={interaction !== null || reveal !== null}
        harvestSignal={harvestSignal}
        equippedSwordId={equippedSwordId}
        onInteract={setInteraction}
      />

      <div className="hud-coins">{currency} coins</div>

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
