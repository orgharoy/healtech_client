import React from 'react'
import { Button } from 'antd'

import PageTitle from '../components/PageTitle' 

const Home = () => {
  return (
    <main>
      <PageTitle pageHeader = {"Home"}/>
      <Button type="primary">Home</Button>
    </main>
    
  )
}

export default Home