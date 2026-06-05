---
title: "Homelab OBS - How I got started"
date: 2026-05-10
slug: homelab-obs
draft: false
tags: [OBS, Home Automation]
---

I finally got some time to work on the Observability for my homelab. 

Prometheus, standard exporters, Grafana, alert-manager, and Jaeger are living in their natural habitat. And… Awkwardly under-utilized.

It's always an incident, like a RAID degradation or some services crashing. We fixed it, and realized that this can be prevented, the signs showed up weeks before!

While setting up the system is simple, it may take an hour to a rainy day morning, to spin up prometheus instances, federate them and configure them with all the necessary exporters on the metals and VPSs, set up wireguard tunnels (nowadays tailscale), then data goes to a TSDB file on the disk, sleeps well there. After all it's lunchtime on a weekend, rain stops after lunch, and it's a good day to bike in it alongside the Arakawa River.

What prioritized this was an incident in the summer of 2023. I did not close my fridge door properly on an afternoon, so next morning I woke up to a fridge in room temperature, yes, including the freezer compartment. Heart broken, I had lost about 12000 Yen worth of meat and sweets. Especially for the sweets, I got them with a one-time 50% off coupon from Uber Eats with free delivery.

> Incident Report: Cryogenic Containment Failure due to Operator Error On Particle Decelerator in LDK
>
> Type: Operator Error
>
> Timeline: 
>
> 2023-07-16, PM: a human operator failed to seal containment boundary (aka. the door) to the particle decelerator(PD) placed at the LDK (Living-Dining-Kitchen). Duration unknown.
>
> 2023-07-18, AM: the same human operator observed the latch door on the particle decelerator is loose. Upon confirming, both refrigeration and freezer units have reached ambient temperature.
>
> 2023-07-18, PM: PD returned fully operational at correct presets.
>
> Remediation:
>
> 2023-07-18, AM: inventory check triaged, icecreams were disposed of, milk was consumed by the operator on spot, meat products were scheduled for emergency consumption within 4 days risk window.
>
> 2023-07-18, AM: PD disconnected from mains, interior surfaces were cleaned, internal components (shelving, drawers, and the egg rack) were removed, decontaminated, dried and reinstalled. 
>
> 2023-07-18, PM: Inspected door hinge, latch, and gasket seal, all functional. Mechanical fault excluded.
>
> 2023-07-18, PM: After a few hours of running, PD returned to expected operating temperature.
>
> 2023-07-18, PM: Meat products were placed back into refrigerator compartment. Freezer compartment remains empty.
>
> Root Cause Analysis:
>
> There's no mechanical fault observed on the locking mechanism. Door function-tested through repeated closure cycles at varying force, gaskets were able to achieve full seal in all trials. Equipment failure was eliminated. Root cause attributed to an operator error. 
>
> Review:
>
> The estimated loss of inventory value is about 11200 yen (10000 yen worth of meat product from "themeatguy", and 2400 yen worth of  icecream products at discounted prices of 1200 yen).
>
> *What went well*: the meats are still edible, at least good for 4 days.
>
> *What could have been handled better*: Some of the icecream products were still edible at an ambient temperature, e.g. the tiramisu. Should have not been disposed of.
>
> Follow-up:
>
> - Additional monitoring should be added.
> - Alerts should fire when temperature rises over a certain threshold  

In the evening, I immediately purchased a 開閉センサー(Contact Sensor) and a 防水温湿度計(Waterproof Temperature/Humidity Sensor) set from SwitchBot. Both will work with my existing SwitchBot setup with Home Assistant. I already configured HASS with [prometheus](https://www.home-assistant.io/integrations/prometheus/) exporter.

For HASS, if there are too many components, or you have enabled BLE logging, a scrape may take some minutes. So we should just include the necessities only:

```yaml
# configuration.yaml
prometheus:
  requires_auth: false
  include_domains:
    - light
    - binary_sensor
    - sensor
```

Then I set up the alertmanager to watch for `homeassistant_sensor_temperature_celsius` and fire alerts when it goes beyond 9.5C for an hour.

```yaml
# reconstruction* of alertmanager.yaml
  - name: fridge
    rules:
      - alert: FridgeTempHigh
        expr: homeassistant_sensor_temperature_celsius{friendly_name="Fridge LDK"} > 15
        for: 60m
        labels:
          severity: warning
        annotations:
          summary: "LDK Fridge above 15°C for over an hour"
          description: "{{ $labels.friendly_name }} is at {{ $value | printf \"%.1f\" }}°C (>15°C for 60m)."
```

After creating a dashboard for the fridge (power and temperature), this completes a cycle and finally got everything to Grafana. 

That year I've also configured mimir with Backblaze B2, and started a free account on Grafana Cloud. While the 10G storage from Grafana's offering is very generous, some limits on time series eventually became the bottleneck, plus dashboard count limits really bugged me. At the same time, mimir depletes free API calls on B2 quite often. So I moved off the clouds a year after. My biggest regret being that I thought those data and configurations were disposable and deleted them. Many years passed, when I finally wanted to write about this, I didn't have data to show. 

But anyway, writing a blog is not a performance review, it's just to show something I had fun with!

Cheers!
