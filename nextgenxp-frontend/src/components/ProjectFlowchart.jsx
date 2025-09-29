import { useState, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'

const ProjectFlowchart = ({ project, onFlowchartUpdate }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(project.flowchart?.nodes || [])
  const [edges, setEdges, onEdgesChange] = useEdgesState(project.flowchart?.edges || [])
  const [newNodeLabel, setNewNodeLabel] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  // Marcar como alterado quando nodes ou edges mudarem
  useEffect(() => {
    setHasChanges(true)
  }, [nodes, edges])

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const addNewNode = () => {
    if (!newNodeLabel.trim()) return

    const newNode = {
      id: `node_${Date.now()}`,
      data: { label: newNodeLabel },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      type: 'default',
    }

    setNodes((nds) => [...nds, newNode])
    setNewNodeLabel('')
  }

  const deleteSelectedNodes = () => {
    setNodes((nds) => nds.filter((node) => !node.selected))
    setEdges((eds) => eds.filter((edge) => !edge.selected))
  }

  const saveFlowchart = async () => {
    const flowchartData = {
      nodes: nodes.map(node => ({
        id: node.id,
        data: node.data,
        position: node.position,
        type: node.type || 'default'
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'default'
      }))
    }

    await onFlowchartUpdate(project.id, flowchartData)
    setHasChanges(false)
  }

  const resetFlowchart = () => {
    setNodes(project.flowchart?.nodes || [])
    setEdges(project.flowchart?.edges || [])
    setHasChanges(false)
  }

  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        
        <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
          <Card className="w-80">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Controles do Fluxograma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do novo nó"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNewNode()}
                  className="flex-1"
                />
                <Button onClick={addNewNode} size="sm">
                  Adicionar
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={deleteSelectedNodes} 
                  variant="destructive" 
                  size="sm"
                  className="flex-1"
                >
                  Excluir Selecionados
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={saveFlowchart} 
                  disabled={!hasChanges}
                  size="sm"
                  className="flex-1"
                >
                  {hasChanges ? 'Salvar Alterações' : 'Salvo'}
                </Button>
                <Button 
                  onClick={resetFlowchart} 
                  variant="outline" 
                  size="sm"
                  disabled={!hasChanges}
                >
                  Resetar
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p>• Arraste os nós para reposicioná-los</p>
                <p>• Conecte nós arrastando das bordas</p>
                <p>• Clique para selecionar nós/conexões</p>
              </div>
            </CardContent>
          </Card>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default ProjectFlowchart
