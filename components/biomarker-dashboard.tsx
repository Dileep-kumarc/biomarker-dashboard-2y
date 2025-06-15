"use client"

import type React from "react"

import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Activity, Heart, Droplets, Bone, Brain, Zap, Upload, TrendingUp, TrendingDown, Minus } from "lucide-react"
import {
  sampleBiomarkerData,
  clinicalRanges,
  getRiskLevel,
  getClinicalInterpretation,
  type BiomarkerData,
} from "@/lib/data-processor"
import { PDFUpload } from "./pdf-upload"

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
  optimal: {
    label: "Optimal Range",
    color: "hsl(var(--chart-2))",
  },
  borderline: {
    label: "Borderline",
    color: "hsl(var(--chart-3))",
  },
  high: {
    label: "High Risk",
    color: "hsl(var(--chart-4))",
  },
}

interface BiomarkerCardProps {
  title: string
  value: number
  unit: string
  parameter: string
  icon: React.ReactNode
  trend?: "up" | "down" | "stable"
  previousValue?: number
}

function BiomarkerCard({ title, value, unit, parameter, icon, trend, previousValue }: BiomarkerCardProps) {
  const riskLevel = getRiskLevel(value, parameter)
  const interpretation = getClinicalInterpretation(parameter, value)

  const riskColors = {
    optimal: "bg-green-100 text-green-800 border-green-200",
    borderline: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  }

  const getTrendIcon = () => {
    if (!trend) return null
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case "stable":
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendText = () => {
    if (!previousValue) return ""
    const change = (((value - previousValue) / previousValue) * 100).toFixed(1)
    return `${change > 0 ? "+" : ""}${change}%`
  }

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-1">
          {getTrendIcon()}
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <Badge className={`${riskColors[riskLevel]}`}>{riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}</Badge>
          {previousValue && <span className="text-xs text-gray-500">{getTrendText()}</span>}
        </div>
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{interpretation}</p>
      </CardContent>
    </Card>
  )
}

export function BiomarkerDashboard() {
  const [selectedBiomarker, setSelectedBiomarker] = useState("totalCholesterol")
  const [biomarkerData, setBiomarkerData] = useState<BiomarkerData[]>(sampleBiomarkerData)
  const [showUpload, setShowUpload] = useState(false)

  const handleNewData = (newData: BiomarkerData) => {
    setBiomarkerData((prev) => {
      const updated = [...prev, newData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      return updated
    })
    setShowUpload(false)
  }

  const latestData = biomarkerData[biomarkerData.length - 1]
  const previousData = biomarkerData.length > 1 ? biomarkerData[biomarkerData.length - 2] : undefined

  const getTrend = (current: number, previous?: number): "up" | "down" | "stable" => {
    if (!previous) return "stable"
    const diff = Math.abs(current - previous)
    const threshold = current * 0.05 // 5% threshold
    if (diff < threshold) return "stable"
    return current > previous ? "up" : "down"
  }

  const biomarkerOptions = [
    { key: "totalCholesterol", label: "Total Cholesterol", icon: <Heart className="h-4 w-4" /> },
    { key: "hdlCholesterol", label: "HDL Cholesterol", icon: <Heart className="h-4 w-4" /> },
    { key: "ldlCholesterol", label: "LDL Cholesterol", icon: <Heart className="h-4 w-4" /> },
    { key: "triglycerides", label: "Triglycerides", icon: <Droplets className="h-4 w-4" /> },
    { key: "creatinine", label: "Creatinine", icon: <Activity className="h-4 w-4" /> },
    { key: "vitaminD", label: "Vitamin D", icon: <Bone className="h-4 w-4" /> },
    { key: "vitaminB12", label: "Vitamin B12", icon: <Brain className="h-4 w-4" /> },
    { key: "hba1c", label: "HbA1c", icon: <Zap className="h-4 w-4" /> },
  ]

  const chartData = biomarkerData
    .filter((data) => data[selectedBiomarker as keyof BiomarkerData] !== undefined)
    .map((data) => ({
      date: new Date(data.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "2-digit",
      }),
      value: data[selectedBiomarker as keyof typeof data] as number,
      fullDate: data.date,
    }))

  const currentRange = clinicalRanges[selectedBiomarker]
  const selectedOption = biomarkerOptions.find((opt) => opt.key === selectedBiomarker)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">EcoTown Health Dashboard</h1>
          <p className="text-lg text-gray-600">Biomarker Time Series Visualization</p>
          <p className="text-sm text-gray-500">Patient: MR. MANJUNATH SWAMY (56Y/M)</p>
          <div className="flex justify-center gap-2 mt-4">
            <Button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {showUpload ? "Hide Upload" : "Upload New Report"}
            </Button>
          </div>
        </div>

        {/* PDF Upload Section */}
        {showUpload && <PDFUpload onDataExtracted={handleNewData} />}

        {/* Alert for Critical Values */}
        <Alert className="border-amber-200 bg-amber-50">
          <Activity className="h-4 w-4" />
          <AlertDescription>
            <strong>Clinical Alert:</strong> Vitamin D levels show deficiency trend. HDL cholesterol below optimal
            range. Recommend consultation with healthcare provider.
          </AlertDescription>
        </Alert>

        {/* Biomarker Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <BiomarkerCard
            title="Total Cholesterol"
            value={latestData.totalCholesterol}
            unit="mg/dL"
            parameter="totalCholesterol"
            icon={<Heart className="h-4 w-4 text-red-500" />}
            trend={getTrend(latestData.totalCholesterol, previousData?.totalCholesterol)}
            previousValue={previousData?.totalCholesterol}
          />
          <BiomarkerCard
            title="HDL Cholesterol"
            value={latestData.hdlCholesterol}
            unit="mg/dL"
            parameter="hdlCholesterol"
            icon={<Heart className="h-4 w-4 text-green-500" />}
            trend={getTrend(latestData.hdlCholesterol, previousData?.hdlCholesterol)}
            previousValue={previousData?.hdlCholesterol}
          />
          <BiomarkerCard
            title="Creatinine"
            value={latestData.creatinine}
            unit="mg/dL"
            parameter="creatinine"
            icon={<Activity className="h-4 w-4 text-blue-500" />}
            trend={getTrend(latestData.creatinine, previousData?.creatinine)}
            previousValue={previousData?.creatinine}
          />
          <BiomarkerCard
            title="Vitamin D"
            value={latestData.vitaminD}
            unit="ng/mL"
            parameter="vitaminD"
            icon={<Bone className="h-4 w-4 text-orange-500" />}
            trend={getTrend(latestData.vitaminD, previousData?.vitaminD)}
            previousValue={previousData?.vitaminD}
          />
        </div>

        {/* Main Chart Section - Fixed Layout */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedOption?.icon}
              Time Series Analysis - {selectedOption?.label}
            </CardTitle>
            <CardDescription>Interactive biomarker trends with clinical reference ranges over time</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={selectedBiomarker} onValueChange={setSelectedBiomarker} className="w-full">
              <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-6 w-full">
                {biomarkerOptions.map((option) => (
                  <TabsTrigger key={option.key} value={option.key} className="text-xs px-2">
                    {option.label.split(" ")[0]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Fixed Chart Container */}
              <div className="w-full h-[450px] bg-white rounded-lg border p-4">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#666" }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={{ stroke: "#666" }}
                        label={{
                          value: currentRange?.unit || "",
                          angle: -90,
                          position: "insideLeft",
                          style: { textAnchor: "middle" },
                        }}
                        width={60}
                      />

                      {/* Clinical Reference Lines */}
                      {currentRange && (
                        <>
                          <ReferenceLine
                            y={currentRange.optimal.max}
                            stroke="#22c55e"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            label={{
                              value: `Optimal Max: ${currentRange.optimal.max}`,
                              position: "topRight",
                              style: { fontSize: "12px", fill: "#22c55e" },
                            }}
                          />
                          {currentRange.borderline && (
                            <ReferenceLine
                              y={currentRange.borderline.max}
                              stroke="#f59e0b"
                              strokeDasharray="5 5"
                              strokeWidth={2}
                              label={{
                                value: `Borderline: ${currentRange.borderline.max}`,
                                position: "topRight",
                                style: { fontSize: "12px", fill: "#f59e0b" },
                              }}
                            />
                          )}
                          <ReferenceLine
                            y={currentRange.high.min}
                            stroke="#ef4444"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            label={{
                              value: `High Risk: ${currentRange.high.min}`,
                              position: "topRight",
                              style: { fontSize: "12px", fill: "#ef4444" },
                            }}
                          />
                        </>
                      )}

                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        labelFormatter={(value) => `Date: ${value}`}
                        formatter={(value: number) => [
                          `${value} ${currentRange?.unit || ""}`,
                          currentRange?.parameter || "Value",
                        ]}
                      />

                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-value)"
                        strokeWidth={3}
                        dot={{
                          fill: "var(--color-value)",
                          strokeWidth: 2,
                          r: 6,
                          stroke: "#fff",
                        }}
                        activeDot={{
                          r: 8,
                          stroke: "var(--color-value)",
                          strokeWidth: 2,
                          fill: "#fff",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Chart Summary */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Latest Value:</span>
                    <span className="ml-2">
                      {chartData[chartData.length - 1]?.value} {currentRange?.unit}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Data Points:</span>
                    <span className="ml-2">{chartData.length} measurements</span>
                  </div>
                  <div>
                    <span className="font-medium">Date Range:</span>
                    <span className="ml-2">
                      {chartData[0]?.date} - {chartData[chartData.length - 1]?.date}
                    </span>
                  </div>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Clinical Interpretation Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Ranges Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(clinicalRanges).map(([key, range]) => (
                <div key={key} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">{range.parameter}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Optimal:</span>
                      <span className="text-green-600">
                        {range.optimal.min}-{range.optimal.max} {range.unit}
                      </span>
                    </div>
                    {range.borderline && (
                      <div className="flex justify-between">
                        <span>Borderline:</span>
                        <span className="text-yellow-600">
                          {range.borderline.min}-{range.borderline.max} {range.unit}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>High Risk:</span>
                      <span className="text-red-600">
                        &gt;{range.high.min} {range.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800">Immediate Attention</h4>
                  <p className="text-sm text-red-700">
                    Vitamin D deficiency requires supplementation. Consult physician.
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800">Monitor Closely</h4>
                  <p className="text-sm text-yellow-700">
                    HDL cholesterol below optimal. Increase physical activity and omega-3 intake.
                  </p>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800">Maintain Current</h4>
                  <p className="text-sm text-green-700">
                    HbA1c and LDL levels are well controlled. Continue current lifestyle.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 border-t pt-4">
          <p>EcoTown Health Tech Dashboard | Data extracted from health reports | For healthcare professional use</p>
          <p className="mt-1">Last updated: {new Date().toLocaleDateString()} | Next review recommended in 3 months</p>
        </div>
      </div>
    </div>
  )
}
