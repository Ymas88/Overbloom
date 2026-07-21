import { useEffect, useState } from 'react'
import { getSubjects, addSubject } from './storage/subjects'
import { getSessions } from './storage/sessions'
import { getHarvests, setHarvestedAt } from './storage/harvests'
import { getCurrency, addCurrency } from './storage/currency'
import { getLootBoxCount, addLootBox, removeLootBox } from './storage/lootboxes'
import { getSeeds, addSeed } from './storage/seeds'
import { getSubjectCrops, setSubjectCrop } from './storage/subjectCrops'
import { LOOT_BOX_PRICE } from './game/shop'
import { drawRandomCrop, getCropOrDefault, RARITIES } from './game/crops'
import FarmCanvas from './components/FarmCanvas'
import FarmhousePanel from './components/FarmhousePanel'
import PlotPanel from './components/PlotPanel'
import InventoryPanel from './components/InventoryPanel'
import ShopPanel from './components/ShopPanel'

function App() {
  const [subjects, setSubjects] = useState([])
  const [sessions, setSessions] = useState([])
  const [harvests, setHarvests] = useState({})
  const [currency, setCurrency] = useState(0)
  const [lootBoxes, setLootBoxes] = useState(0)
  const [seeds, setSeeds] = useState({})
  const [subjectCrops, setSubjectCrops] = useState({})
  const [lastReveal, setLastReveal] = useState(null)
  const [interaction, setInteraction] = useState(null) // null | {type:'farmhouse'} | {type:'plot', subjectId} | {type:'shop'} | {type:'inventory'}

  useEffect(() => {
    setSubjects(getSubjects())
    setSessions(getSessions())
    setHarvests(getHarvests())
    setCurrency(getCurrency())
    setLootBoxes(getLootBoxCount())
    setSeeds(getSeeds())
    setSubjectCrops(getSubjectCrops())
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && interaction) setInteraction(null)
      if ((e.key === 'i' || e.key === 'I') && !interaction) setInteraction({ type: 'inventory' })
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [interaction])

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
    setLastReveal(crop)
  }

  function handleAssignCrop(subjectId, cropId) {
    setSubjectCrops(setSubjectCrop(subjectId, cropId))
  }

  function closePanel() {
    setInteraction(null)
    setLastReveal(null)
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
        paused={interaction !== null}
        onInteract={setInteraction}
      />

      <div className="hud-coins">{currency} coins</div>

      {interaction?.type === 'inventory' && (
        <InventoryPanel
          currency={currency}
          lootBoxes={lootBoxes}
          seeds={seeds}
          lastReveal={lastReveal}
          onOpenLootBox={handleOpenLootBox}
          onClose={closePanel}
        />
      )}

      {interaction?.type === 'shop' && (
        <ShopPanel currency={currency} onBuyLootBox={handleBuyLootBox} onClose={closePanel} />
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
