import { useState } from 'react'

function readFarmer() { try { return JSON.parse(localStorage.getItem('kisansetu-farmer') || 'null') } catch { return null } }

export function useFarmer() {
  const [farmer, setFarmer] = useState(readFarmer)
  function saveFarmer(value) { try { localStorage.setItem('kisansetu-farmer', JSON.stringify(value)) } catch { /* storage is optional */ } setFarmer(value) }
  function clearFarmer() { try { localStorage.removeItem('kisansetu-farmer') } catch { /* storage is optional */ } setFarmer(null) }
  return { farmer, saveFarmer, clearFarmer }
}