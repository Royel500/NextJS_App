'use client'
import { useSession } from 'next-auth/react';
import React from 'react'
import Swal from 'sweetalert2'

export default function  OrderButton({ s }) {

    const { data: session, status } = useSession();
    const emaill = session?.user?.email;
    
  const handleOrder = async () => {
    let raw = null
    let employees = []

    try {
      const res = await fetch('/api/employee')
      if (!res.ok) throw new Error(`Employee fetch failed: ${res.status}`)
      raw = await res.json()
      console.debug('Raw /api/employee response:', raw)

      // Normalize common shapes:
      if (Array.isArray(raw)) {
        employees = raw
      } else if (raw && Array.isArray(raw.data)) {
        employees = raw.data
      } else if (raw && Array.isArray(raw.employees)) {
        employees = raw.employees
      } else if (raw && Array.isArray(raw.result)) {
        employees = raw.result
      } else if (raw && typeof raw === 'object') {
        // maybe the API returned an object whose values are employee objects
        const values = Object.values(raw).filter(v => v && typeof v === 'object')
        // Heuristic: if many values look like employees (have name or position), use them
        const likelyEmployees = values.filter(v => v.name || v.position || v.phone || v.email)
        if (likelyEmployees.length > 0) employees = likelyEmployees
        // otherwise, keep employees empty (no reliable list)
      }

      // Final defensive check: ensure array
      if (!Array.isArray(employees)) employees = []
    } catch (err) {
      console.warn('Could not load employees — proceeding without list', err)
      employees = []
    }

    // Normalize id and build a map to ensure consistent lookups
    const normalized = employees.map(emp => {
      // id could be string, or {_id: {$oid: '..'}}, or {_id: '...'}
      const rawId = emp._id ?? emp.id ?? emp._id?.$oid ?? null
      // handle cases where _id is object like { $oid: '...' }
      const id =
        typeof rawId === 'string'
          ? rawId
          : (rawId && rawId.$oid) || (rawId && rawId.toString && rawId.toString()) || String(emp._id || emp.id || '')
      return {
        ...emp,
        __id: id
      }
    })

    console.debug('Normalized employees:', normalized)

    // Build select HTML. Always include "No preference" as first option.
    const optionsHtml = [
      `<option value="">No preference — assign later</option>`,
      ...normalized.map(emp => {
        const name = (emp.name || emp.fullName || 'Unnamed').toString().replace(/"/g, '')
        const pos = (emp.position || 'Unknown').toString()
        const safeId = emp.__id || ''
        return `<option value="${safeId}">${name} — ${pos}</option>`
      })
    ].join('')


    const modalHtml =
    
      `<input id="swal-name" type="text" class="swal2-input" placeholder="Your Name">` +
      `<input id="swal-email" type="email" class="swal2-input" placeholder="Your Email">` +
      `<input id="swal-phone" type="tel" style="padding-bottom:20px" class="swal2-input" placeholder="Your Phone Number" pattern="[0-9+\\-\\s()]{10,}">` +
`<label style="width:80%; padding:3px; padding-top:2.5rem; text-align:center; font-weight:600;">
   Select Developer (optional)
 </label>` +
      `<select id="swal-developer" class="swal2-select" style="width:70%;padding:2px;border-radius:6px;">${optionsHtml}</select>`

    const { value: formValues } = await Swal.fire({
      title: 'Confirm Order',
      width: '25rem',
      html: modalHtml,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = document.getElementById('swal-name')?.value.trim()
        const email = document.getElementById('swal-email')?.value.trim()
        const phoneRaw = document.getElementById('swal-phone')?.value.trim()
        const devId = document.getElementById('swal-developer')?.value

        if (!name || !email || !phoneRaw) {
          Swal.showValidationMessage('Please enter name, email, and phone number')
          return false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          Swal.showValidationMessage('Invalid email address')
          return false
        }
        const cleanPhone = phoneRaw.replace(/\D/g, '')
        if (cleanPhone.length < 10) {
          Swal.showValidationMessage('Phone number must be at least 10 digits')
          return false
        }

        // Find developer in normalized list by __id
        const selectedDev = normalized.find(e => (e.__id || '') === devId) || null

        return {
          name,
          email,
          businessEmail : emaill,
          phone: cleanPhone,
          developerId: selectedDev ? selectedDev.__id : null,
          developerName: selectedDev ? (selectedDev.name || selectedDev.fullName) : null,
          developerPosition: selectedDev ? selectedDev.position : null
        }
      }
    })

    if (!formValues) return

    try {
      const payload = {
        sId: s._id ?? s.id ?? null,
        sName: s.name ?? '',
        price: s.price ?? 0,
         businessEmail : emaill,
        userName: formValues.name,
        userEmail: formValues.email,
        userNumber: formValues.phone
      }

      if (formValues.developerId) {
        payload.assignedDeveloperId = formValues.developerId
        payload.assignedDeveloperName = formValues.developerName
        payload.assignedDeveloperPosition = formValues.developerPosition
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        let errMsg = `Order save failed: ${res.status}`
        try {
          const json = await res.json()
          if (json?.message) errMsg = json.message
        } catch (e) {}
        throw new Error(errMsg)
      }

      await Swal.fire('Success', 'Your order has been placed!', 'success')
    } catch (err) {
      console.error(err)
      await Swal.fire('Error', err.message || 'Something went wrong', 'error')
    }
  }

  return (
    <button onClick={handleOrder} className="mt-4 btn btn-primary">
      Hire Now
    </button>
  )
}
