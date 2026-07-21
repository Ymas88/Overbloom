import { CROPS, RARITIES } from '../game/crops'

function SubjectList({ subjects, seeds, subjectCrops, onAssignCrop }) {
  if (subjects.length === 0) {
    return <p>No subjects yet.</p>
  }

  const ownedCrops = CROPS.filter((crop) => (seeds[crop.id] ?? 0) > 0)

  return (
    <ul>
      {subjects.map((subject) => {
        const assignedCropId = subjectCrops[subject.id] ?? ''
        return (
          <li key={subject.id}>
            <span className="seed-name">
              {assignedCropId && (
                <img src={`/sprites/crops/${assignedCropId}.png`} alt="" className="crop-icon" />
              )}
              {subject.name}
            </span>
            <select
              value={assignedCropId}
              onChange={(e) => onAssignCrop(subject.id, e.target.value || null)}
            >
              <option value="">No seed planted</option>
              {ownedCrops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name} ({RARITIES[crop.rarity].label}) — {seeds[crop.id]} owned
                </option>
              ))}
            </select>
          </li>
        )
      })}
    </ul>
  )
}

export default SubjectList
