# Generated by Django 4.1.1 on 2022-10-12 08:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('system', '0006_candidate_party_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='poll',
            name='published',
            field=models.BooleanField(default=False),
        ),
    ]
