{{/*
Expand the name of the chart.
*/}}
{{- define "nano.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "nano.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "nano.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "nano.labels" -}}
helm.sh/chart: {{ include "nano.chart" . }}
{{ include "nano.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- with .Values.commonLabels }}
{{ toYaml . }}
{{- end }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "nano.selectorLabels" -}}
app.kubernetes.io/name: {{ include "nano.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "nano.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "nano.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
PostgreSQL service name
*/}}
{{- define "nano.postgresql.servicename" -}}
{{- if .Values.postgresql.enabled }}
{{- printf "%s-postgresql" .Release.Name }}
{{- else }}
{{- required "A valid .Values.postgresql.external.host is required!" .Values.postgresql.external.host }}
{{- end }}
{{- end }}

{{/*
PostgreSQL port
*/}}
{{- define "nano.postgresql.port" -}}
{{- if .Values.postgresql.enabled }}
{{- .Values.postgresql.primary.service.ports.postgresql | default 5432 }}
{{- else }}
{{- .Values.postgresql.external.port | default 5432 }}
{{- end }}
{{- end }}

{{/*
Image name
*/}}
{{- define "nano.image" -}}
{{- printf "%s:%s" .Values.global.image.repository (.Values.global.image.tag | default .Chart.AppVersion) }}
{{- end }}

{{/*
Runner pool name - expects runner context with .runner and .root
*/}}
{{- define "nano.runner.name" -}}
{{- printf "%s-runner-%s" (include "nano.fullname" .root) .runner.name }}
{{- end }}

{{/*
Runner labels - expects runner context with .runner and .root
*/}}
{{- define "nano.runner.labels" -}}
{{- include "nano.labels" .root }}
app.kubernetes.io/component: runner
app.kubernetes.io/runner-pool: {{ .runner.name }}
{{- end }}

{{/*
Runner selector labels - expects runner context with .runner and .root
*/}}
{{- define "nano.runner.selectorLabels" -}}
{{- include "nano.selectorLabels" .root }}
app.kubernetes.io/component: runner
app.kubernetes.io/runner-pool: {{ .runner.name }}
{{- end }}

{{/*
Generate initial runners list for API autoregistration
*/}}
{{- define "nano.initialRunners" -}}
{{- $runners := list -}}
{{- range .Values.runners -}}
{{- if .enabled -}}
{{- $runner := . -}}
{{- $root := $ -}}
{{- $runnerName := include "nano.runner.name" (dict "runner" $runner "root" $root) -}}
{{- $headlessServiceName := printf "%s-headless" $runnerName -}}
{{- $port := .port | default 8080 | toString -}}
{{- range $i := until (.instances | int) -}}
{{- $tokenVar := printf "%s_%d" ($runnerName | upper | replace "-" "_") $i -}}
{{- $podHostname := printf "%s-%d.%s" $runnerName $i $headlessServiceName -}}
{{- $runnerUrl := printf "http://$${%s}@%s:%s" $tokenVar $podHostname $port -}}
{{- $runners = append $runners $runnerUrl -}}
{{- end -}}
{{- end -}}
{{- end -}}
{{- join "," $runners -}}
{{- end }}