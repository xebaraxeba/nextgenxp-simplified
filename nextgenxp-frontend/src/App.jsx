import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import ProjectFlowchart from './components/ProjectFlowchart'
import './App.css'

function App() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carregar projetos do backend
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/projects')
      if (!response.ok) {
        throw new Error('Erro ao carregar projetos')
      }
      const data = await response.json()
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
  }

  const handleBackToProjects = () => {
    setSelectedProject(null)
    fetchProjects() // Recarregar projetos para pegar atualizações
  }

  const handleFlowchartUpdate = async (projectId, flowchartData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/flowchart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flowchartData),
      })
      
      if (!response.ok) {
        throw new Error('Erro ao salvar fluxograma')
      }
      
      // Atualizar o projeto selecionado com os novos dados
      setSelectedProject(prev => ({
        ...prev,
        flowchart: flowchartData
      }))
    } catch (err) {
      console.error('Erro ao salvar fluxograma:', err)
      alert('Erro ao salvar fluxograma: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Carregando...</h2>
          <p className="text-muted-foreground">Aguarde enquanto carregamos os projetos</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-destructive">Erro</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchProjects}>Tentar Novamente</Button>
        </div>
      </div>
    )
  }

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handleBackToProjects}
              className="mb-4"
            >
              ← Voltar aos Projetos
            </Button>
            <h1 className="text-3xl font-bold mb-2">{selectedProject.name}</h1>
            <p className="text-muted-foreground">{selectedProject.description}</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Fluxograma do Projeto</CardTitle>
              <CardDescription>
                Visualize e edite o fluxograma interativo do projeto. Você pode arrastar os nós, 
                adicionar novas conexões e modificar o layout conforme necessário.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectFlowchart 
                project={selectedProject}
                onFlowchartUpdate={handleFlowchartUpdate}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Painel de Gestão NextGenXP</h1>
          <p className="text-xl text-muted-foreground">
            Gerencie seus projetos através de fluxogramas interativos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleProjectSelect(project)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <Badge variant="secondary">
                    {project.flowchart?.nodes?.length || 0} nós
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Visualizar Fluxograma
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground">
              Não há projetos disponíveis no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
