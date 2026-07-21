import { useEffect, useState } from 'react'
import { getSubjects, addSubject } from './storage/subjects'
import { getSessions } from './storage/sessions'
import { getHarvests, setHarvestedAt } from './storage/harvests'
import { getCurrency, addCurrency } from './storage/currency'
import { HARVEST_REWARD } from './game/growth'
import FarmCanvas from './components/FarmCanvas'
import FarmhousePanel from './components/FarmhousePanel'
import PlotPanel from './components/PlotPanel'
import InventoryPanel from './components/InventoryPanel'

function App() {
  const [subjects, setSubjects] = useState([])
  const [sessions, setSessions] = useState([])
  const [harvests, setHarvests] = useState({})
  const [currency, setCurrency] = useState(0)
  const [interaction, setInteraction] = useState(null) // null | {type:'farmhouse'} | {type:'plot', subjectId}

  useEffect(() => {
    setSubjects(getSubjects())
    setSessions(getSessions())
    setHarvests(getHarvests())
    setCurrency(getCurrency())
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
    setCurrency(addCurrency(HARVEST_REWARD))
    setHarvests(setHarvestedAt(subjectId, Date.now()))
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
        paused={interaction !== null}
        onInteract={setInteraction}
      />

      <div className="hud-coins">{currency} coins</div>

      {interaction?.type === 'inventory' && (
        <InventoryPanel currency={currency} onClose={closePanel} />
      )}

      {interaction?.type === 'farmhouse' && (
        <FarmhousePanel
          subjects={subjects}
          sessions={sessions}
          currency={currency}
          onAddSubject={handleAddSubject}
          onSessionSaved={handleSessionSaved}
          onClose={closePanel}
        />
      )}

      {activePlotSubject && (
        <PlotPanel
          subject={activePlotSubject}
          sessions={sessions}
          harvestedAt={harvests[activePlotSubject.id] ?? 0}
          onSessionSaved={handleSessionSaved}
          onHarvest={handleHarvest}
          onClose={closePanel}
        />
      )}
    </div>
  )
}

export default App
