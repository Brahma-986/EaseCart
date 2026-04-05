import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'easecart-engagement'

function getId(product) {
  return product?._id || product?.id
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { wishlist: [], recentlyViewed: [] }
    const parsed = JSON.parse(raw)
    return {
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
      recentlyViewed: Array.isArray(parsed.recentlyViewed) ? parsed.recentlyViewed : [],
    }
  } catch {
    return { wishlist: [], recentlyViewed: [] }
  }
}

function saveState(state) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      wishlist: state.wishlist,
      recentlyViewed: state.recentlyViewed,
    })
  )
}

const initialState = loadState()

const engagementSlice = createSlice({
  name: 'engagement',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload
      const id = getId(product)
      if (!id) return
      const idx = state.wishlist.findIndex((p) => getId(p) === id)
      if (idx >= 0) state.wishlist.splice(idx, 1)
      else state.wishlist.unshift(product)
      saveState(state)
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload
      state.wishlist = state.wishlist.filter((p) => getId(p) !== id)
      saveState(state)
    },
    addRecentlyViewed: (state, action) => {
      const product = action.payload
      const id = getId(product)
      if (!id) return
      state.recentlyViewed = state.recentlyViewed.filter((p) => getId(p) !== id)
      state.recentlyViewed.unshift(product)
      state.recentlyViewed = state.recentlyViewed.slice(0, 12)
      saveState(state)
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = []
      saveState(state)
    },
  },
})

export const { toggleWishlist, removeFromWishlist, addRecentlyViewed, clearRecentlyViewed } =
  engagementSlice.actions
export default engagementSlice.reducer
