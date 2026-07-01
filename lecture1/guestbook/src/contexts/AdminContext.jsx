import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AdminContext = createContext(null)

export const useAdmin = () => useContext(AdminContext)

export const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) checkAdmin(session.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkAdmin(session.user)
      } else {
        setUser(null)
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdmin = async (authUser) => {
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', authUser.id)
      .single()
    setUser(authUser)
    setIsAdmin(data?.is_admin === true)
  }

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AdminContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}
