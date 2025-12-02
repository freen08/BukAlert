import { useState, useEffect } from 'react'
import type { Bookmark } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useBookmarks = () => {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  // Load bookmarks when user changes
  useEffect(() => {
    if (user) {
      loadBookmarks()
    } else {
      setBookmarks([])
      setLoading(false)
    }
  }, [user])

  const loadBookmarks = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      setBookmarks(data || [])
    } catch (error) {
      console.error('Error loading bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  const addBookmark = async (teamId: string) => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          team_id: teamId,
        })
        .select()
        .single()

      if (error) throw error

      setBookmarks(prev => [...prev, data])
      return true
    } catch (error) {
      console.error('Error adding bookmark:', error)
      return false
    }
  }

  const removeBookmark = async (teamId: string) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('team_id', teamId)

      if (error) throw error

      setBookmarks(prev => prev.filter(bookmark => bookmark.team_id !== teamId))
      return true
    } catch (error) {
      console.error('Error removing bookmark:', error)
      return false
    }
  }

  const toggleBookmark = async (teamId: string) => {
    const isBookmarked = isTeamBookmarked(teamId)

    if (isBookmarked) {
      return await removeBookmark(teamId)
    } else {
      return await addBookmark(teamId)
    }
  }

  const isTeamBookmarked = (teamId: string) => {
    return bookmarks.some(bookmark => bookmark.team_id === teamId)
  }

  const getBookmarkedTeamIds = () => {
    return bookmarks.map(bookmark => bookmark.team_id)
  }

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isTeamBookmarked,
    getBookmarkedTeamIds,
    refetchBookmarks: loadBookmarks,
  }
}
